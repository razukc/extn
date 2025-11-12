/**
 * Template Engine for rendering template files with variable substitution
 */

export interface TemplateContext {
  projectName: string;
  version: string;
  description: string;
  author?: string;
  [key: string]: string | undefined;
}

export interface TemplateFile {
  path: string;
  content: string;
  encoding: 'utf-8' | 'binary';
}

export class TemplateEngine {
  /**
   * Render a single file with variable substitution
   * Supports {{variable}} syntax and {{#if condition}}...{{/if}} conditionals
   */
  renderFile(content: string, context: TemplateContext): string {
    let result = content;

    // Process conditionals first: {{#if variable}}...{{/if}}
    result = this.processConditionals(result, context);

    // Process variable substitution: {{variable}}
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * Render all files in a template directory
   */
  async render(
    templatePath: string,
    context: TemplateContext
  ): Promise<TemplateFile[]> {
    const fsModule = await import('fs-extra');
    const fs = fsModule.default;
    const pathModule = await import('path');
    const path = pathModule.default;
    const files: TemplateFile[] = [];

    const processDirectory = async (dirPath: string, relativePath = '') => {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const relPath = path.join(relativePath, entry);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await processDirectory(fullPath, relPath);
        } else if (stats.isFile()) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const renderedContent = this.renderFile(content, context);
          
          // Process filename for variable substitution
          const renderedPath = this.renderFile(relPath, context);

          files.push({
            path: renderedPath,
            content: renderedContent,
            encoding: 'utf-8',
          });
        }
      }
    };

    await processDirectory(templatePath);
    return files;
  }

  /**
   * Render template with inheritance support
   * Renders base template first, then specific template, and merges the results
   */
  async renderWithInheritance(
    templatePath: string,
    basePath: string | undefined,
    context: TemplateContext
  ): Promise<TemplateFile[]> {
    // If no base template, render normally
    if (!basePath) {
      return this.render(templatePath, context);
    }

    const fsModule = await import('fs-extra');
    const fs = fsModule.default;

    // Check if base path exists (use async stat instead of existsSync)
    try {
      await fs.stat(basePath);
    } catch {
      // Base path doesn't exist, render normally
      return this.render(templatePath, context);
    }

    // Render base template files
    const baseFiles = await this.render(basePath, context);

    // Render specific template files
    const templateFiles = await this.render(templatePath, context);

    // Special handling for package.json merging BEFORE merging partial files
    const basePackageFile = baseFiles.find(
      f => f.path === 'package.json.template' || f.path === 'package.json'
    );
    const templatePackageFile = templateFiles.find(
      f => f.path === 'package.json.template' || f.path === 'package.json'
    );

    // If both base and template have package.json, merge them
    if (basePackageFile && templatePackageFile) {
      try {
        const basePackage = JSON.parse(basePackageFile.content);
        const templatePackage = JSON.parse(templatePackageFile.content);
        const mergedPackage = this.mergePackageJson(basePackage, templatePackage);
        
        // Replace the template package.json with the merged version
        const templateIndex = templateFiles.findIndex(
          f => f.path === templatePackageFile.path
        );
        if (templateIndex !== -1) {
          templateFiles[templateIndex] = {
            path: templatePackageFile.path,
            content: JSON.stringify(mergedPackage, null, 2),
            encoding: templatePackageFile.encoding,
          };
        }
      } catch (error) {
        // If JSON parsing fails, keep template version
        // Error will be caught during manifest validation
      }
    }

    // Merge partial files
    const mergedFiles = this.mergePartialFiles(baseFiles, templateFiles);

    // Handle file conflicts: template overrides base
    const fileMap = new Map<string, TemplateFile>();

    // Add all merged files (which already handles partial merging and conflicts)
    for (const file of mergedFiles) {
      // Skip partial files from base (they've already been merged)
      if (file.path.includes('.partial.')) {
        continue;
      }
      fileMap.set(file.path, file);
    }

    return Array.from(fileMap.values());
  }

  /**
   * Process conditional blocks: {{#if variable}}...{{/if}}
   */
  private processConditionals(content: string, context: TemplateContext): string {
    const conditionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return content.replace(conditionalRegex, (match, variable, block) => {
      const value = context[variable];
      // Include block if variable exists and is truthy
      return value ? block : '';
    });
  }

  /**
   * Process variable substitution: {{variable}}
   */
  private processVariables(content: string, context: TemplateContext): string {
    const variableRegex = /\{\{(\w+)\}\}/g;

    return content.replace(variableRegex, (match, variable) => {
      const value = context[variable];
      return value !== undefined ? value : match;
    });
  }

  /**
   * Merge base and template-specific package.json configurations
   * Template-specific values override base values on conflict
   */
  mergePackageJson(
    basePackage: Record<string, unknown>,
    templatePackage: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...basePackage,
      ...templatePackage,
      scripts: {
        ...((basePackage.scripts as Record<string, string>) || {}),
        ...((templatePackage.scripts as Record<string, string>) || {}),
      },
      dependencies: this.mergeDependencies(
        (basePackage.dependencies as Record<string, string>) || {},
        (templatePackage.dependencies as Record<string, string>) || {}
      ),
      devDependencies: this.mergeDependencies(
        (basePackage.devDependencies as Record<string, string>) || {},
        (templatePackage.devDependencies as Record<string, string>) || {}
      ),
    };
  }

  /**
   * Merge dependency lists, preferring template-specific versions
   */
  private mergeDependencies(
    base: Record<string, string> = {},
    template: Record<string, string> = {}
  ): Record<string, string> {
    return { ...base, ...template };
  }

  /**
   * Merge partial files from base template with template-specific files
   * Partial files (e.g., .gitignore.partial.template) are appended to template files
   * For README files, replaces placeholder comments with partial content
   */
  mergePartialFiles(
    baseFiles: TemplateFile[],
    templateFiles: TemplateFile[]
  ): TemplateFile[] {
    const result: TemplateFile[] = [];
    const templateFileMap = new Map<string, TemplateFile>();

    // Build map of template files for quick lookup
    for (const file of templateFiles) {
      templateFileMap.set(file.path, file);
    }

    // Process base files
    for (const baseFile of baseFiles) {
      // Check if this is a partial file
      if (baseFile.path.includes('.partial.')) {
        // Extract the target filename (remove .partial from the name)
        const targetPath = baseFile.path.replace('.partial.', '.');
        
        // Check if template has the corresponding file
        const templateFile = templateFileMap.get(targetPath);
        
        if (templateFile) {
          let mergedContent: string;
          
          // Special handling for README files - replace placeholder
          if (targetPath.includes('README')) {
            // Look for placeholder comment and replace it
            const placeholder = '<!-- DEV_WORKFLOW_PARTIAL_PLACEHOLDER -->';
            if (templateFile.content.includes(placeholder)) {
              mergedContent = templateFile.content.replace(placeholder, baseFile.content);
            } else {
              // No placeholder found, append as fallback
              mergedContent = templateFile.content + '\n' + baseFile.content;
            }
          } else {
            // For other files (like .gitignore), append content
            mergedContent = templateFile.content + '\n' + baseFile.content;
          }
          
          result.push({
            path: targetPath,
            content: mergedContent,
            encoding: templateFile.encoding,
          });
          // Remove from map so we don't add it again
          templateFileMap.delete(targetPath);
        } else {
          // No corresponding template file, use partial as-is (remove .partial from name)
          result.push({
            path: targetPath,
            content: baseFile.content,
            encoding: baseFile.encoding,
          });
        }
      } else {
        // Not a partial file, add as-is (will be overridden by template if conflict)
        result.push(baseFile);
      }
    }

    // Add remaining template files that weren't merged
    for (const file of templateFileMap.values()) {
      result.push(file);
    }

    return result;
  }
}
