/**
 * Template Registry for managing extension templates
 */

import * as path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

export interface Template {
  id: string;
  name: string;
  description: string;
  files: string; // Path to template files directory
  dependencies: string[];
  devDependencies: string[];
  scripts?: Record<string, string>; // npm scripts to include in package.json
  extends?: string; // Base template id to extend from
}

export class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  /**
   * Load all available templates
   */
  private loadTemplates(): void {
    // Get the templates directory path
    const templatesDir = this.getTemplatesDir();

    // Load base template first
    const baseMetaPath = path.join(templatesDir, 'base', 'template.json');
    const baseFilesPath = path.join(templatesDir, 'base', 'files');

    if (fs.existsSync(baseMetaPath)) {
      const metadata = fs.readJsonSync(baseMetaPath);
      this.templates.set('base', {
        ...metadata,
        files: baseFilesPath,
      });
    }

    // Load vanilla template
    const vanillaMetaPath = path.join(templatesDir, 'vanilla', 'template.json');
    const vanillaFilesPath = path.join(templatesDir, 'vanilla', 'files');

    if (fs.existsSync(vanillaMetaPath)) {
      const metadata = fs.readJsonSync(vanillaMetaPath);
      this.templates.set('vanilla', {
        ...metadata,
        files: vanillaFilesPath,
      });
    }

    // Load react template
    const reactMetaPath = path.join(templatesDir, 'react', 'template.json');
    const reactFilesPath = path.join(templatesDir, 'react', 'files');

    if (fs.existsSync(reactMetaPath)) {
      const metadata = fs.readJsonSync(reactMetaPath);
      this.templates.set('react', {
        ...metadata,
        files: reactFilesPath,
      });
    }
  }

  /**
   * Get template by id
   */
  get(id: string): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * Get template with base template merged
   * If template extends a base, returns merged template with base metadata
   */
  getWithBase(id: string): Template | undefined {
    const template = this.templates.get(id);
    if (!template) {
      return undefined;
    }

    // If template doesn't extend anything, return as-is
    if (!template.extends) {
      return template;
    }

    // Get base template
    const baseTemplate = this.templates.get(template.extends);
    if (!baseTemplate) {
      // Base template not found, return template as-is
      return template;
    }

    // Merge base and template metadata
    return {
      ...template,
      dependencies: [...baseTemplate.dependencies, ...template.dependencies],
      devDependencies: [
        ...baseTemplate.devDependencies,
        ...template.devDependencies,
      ],
      scripts: {
        ...(baseTemplate.scripts || {}),
        ...(template.scripts || {}),
      },
    };
  }

  /**
   * List all available templates
   */
  list(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Check if template exists
   */
  has(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Get the templates directory path
   */
  private getTemplatesDir(): string {
    // Handle both CommonJS and ESM
    if (typeof __dirname !== 'undefined') {
      // CommonJS
      return path.join(__dirname, '..', '..', 'templates');
    } else {
      // ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      return path.join(__dirname, '..', '..', 'templates');
    }
  }
}
