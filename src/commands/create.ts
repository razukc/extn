/**
 * Create command implementation
 * Scaffolds a new Chrome extension project
 */

import * as path from 'path';
import { FileSystemUtils } from '../utils/fs.js';
import { Logger } from '../utils/logger.js';
import { ValidationError, FileSystemError } from '../utils/errors.js';
import { TemplateEngine } from '../core/template/engine.js';
import { TemplateRegistry } from '../core/template/registry.js';
import { ManifestValidator } from '../core/manifest/validator.js';

export interface CreateCommandOptions {
  template: string;
  directory?: string;
}

export interface CreateCommandResult {
  success: boolean;
  projectPath: string;
  message: string;
}

/**
 * Validate project name
 * Only allows alphanumeric characters, hyphens, and underscores
 */
function validateProjectName(name: string): void {
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  
  if (!validNameRegex.test(name)) {
    throw new ValidationError(
      'Project name can only contain alphanumeric characters, hyphens, and underscores',
      { projectName: name }
    );
  }
}

/**
 * Create command handler
 */
export async function createCommand(
  projectName: string,
  options: CreateCommandOptions
): Promise<CreateCommandResult> {
  const fs = new FileSystemUtils();
  const logger = new Logger();
  const templateEngine = new TemplateEngine();
  const templateRegistry = new TemplateRegistry();
  const manifestValidator = new ManifestValidator(fs);

  let tempDir: string | null = null;

  try {
    // Step 1: Validate project name
    logger.info(`Creating Chrome extension project: ${projectName}`);
    validateProjectName(projectName);

    // Step 2: Resolve target directory
    const targetDir = options.directory
      ? path.resolve(options.directory, projectName)
      : path.resolve(process.cwd(), projectName);

    logger.debug(`Target directory: ${targetDir}`);

    // Step 3: Check if directory exists
    if (await fs.exists(targetDir)) {
      throw new FileSystemError(
        `Directory already exists: ${targetDir}`,
        { path: targetDir }
      );
    }

    // Step 4: Get template with base template merged
    const template = templateRegistry.getWithBase(options.template);
    if (!template) {
      throw new ValidationError(
        `Template not found: ${options.template}`,
        { template: options.template }
      );
    }

    logger.info(`Using template: ${template.name}`);

    // Step 5: Create temporary directory for atomic operations
    logger.startSpinner('Setting up project structure...');
    tempDir = await fs.createTempDir();
    logger.debug(`Temporary directory: ${tempDir}`);

    // Step 6: Prepare template context
    const context = {
      projectName,
      version: '1.0.0',
      description: `${projectName} - Chrome Extension`,
    };

    // Step 7: Render template files with inheritance support
    // Get base template path if template extends base
    let baseTemplatePath: string | undefined;
    if (template.extends) {
      const baseTemplate = templateRegistry.get(template.extends);
      if (baseTemplate) {
        baseTemplatePath = baseTemplate.files;
        logger.debug(`Template extends: ${template.extends}`);
      }
    }

    const templateFiles = await templateEngine.renderWithInheritance(
      template.files,
      baseTemplatePath,
      context
    );
    logger.debug(`Rendered ${templateFiles.length} template files`);

    // Step 8: Write template files to temp directory
    let manifestContent: string | null = null;
    for (const file of templateFiles) {
      // Remove .template extension from file paths
      const targetPath = file.path.replace(/\.template/, '');
      const filePath = path.join(tempDir, targetPath);
      await fs.writeFile(filePath, file.content);
      
      // Capture manifest content for validation
      if (targetPath === 'manifest.json' || file.path === 'manifest.template.json') {
        manifestContent = file.content;
      }
    }

    // Step 9: Parse manifest for validation
    if (!manifestContent) {
      throw new ValidationError(
        'Template does not include a manifest file',
        { template: options.template }
      );
    }
    
    const manifest = JSON.parse(manifestContent);

    logger.stopSpinner(true, 'Project structure created');

    // Step 10: Validate generated structure
    logger.startSpinner('Validating project structure...');
    
    const schemaValidation = manifestValidator.validate(manifest);
    if (!schemaValidation.valid) {
      throw new ValidationError(
        'Generated manifest is invalid',
        { errors: schemaValidation.errors }
      );
    }

    const fileValidation = await manifestValidator.validateFiles(manifest, tempDir);
    if (!fileValidation.valid) {
      throw new ValidationError(
        'Generated project structure is invalid',
        { errors: fileValidation.errors }
      );
    }

    logger.stopSpinner(true, 'Project structure validated');

    // Step 11: Move from temp to target directory atomically
    logger.startSpinner('Finalizing project...');
    await fs.moveAtomic(tempDir, targetDir);
    tempDir = null; // Clear temp dir reference since it's been moved
    logger.stopSpinner(true, 'Project finalized');

    // Step 12: Display success message with next steps
    logger.success(`Project created successfully at: ${targetDir}`);
    logger.box('Next Steps', [
      `cd ${projectName}`,
      'npm install',
      'npm run dev',
    ]);

    return {
      success: true,
      projectPath: targetDir,
      message: 'Project created successfully',
    };
  } catch (error) {
    // Cleanup temp directory on failure
    if (tempDir) {
      try {
        await fs.remove(tempDir);
        logger.debug(`Cleaned up temporary directory: ${tempDir}`);
      } catch (cleanupError) {
        logger.warn(`Failed to cleanup temporary directory: ${tempDir}`);
      }
    }

    // Re-throw the error to be handled by the CLI
    throw error;
  }
}
