import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TemplateEngine, TemplateContext, TemplateFile } from '../../../src/core/template/engine';
import { vol } from 'memfs';
import * as path from 'path';

// Mock fs-extra to use memfs
vi.mock('fs-extra', async () => {
  const memfs = await import('memfs');
  const { fs } = memfs;
  
  return {
    default: {
      ...fs.promises,
      readdir: fs.promises.readdir,
      readFile: fs.promises.readFile,
      stat: fs.promises.stat,
    },
    readdir: fs.promises.readdir,
    readFile: fs.promises.readFile,
    stat: fs.promises.stat,
  };
});

describe('TemplateEngine', () => {
  let engine: TemplateEngine;
  let context: TemplateContext;

  beforeEach(() => {
    engine = new TemplateEngine();
    context = {
      projectName: 'test-extension',
      version: '1.0.0',
      description: 'A test extension',
      author: 'Test Author',
    };
    vol.reset();
  });

  afterEach(() => {
    vol.reset();
  });

  describe('renderFile', () => {
    it('should substitute variables with context values', () => {
      const template = 'Project: {{projectName}}, Version: {{version}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Project: test-extension, Version: 1.0.0');
    });

    it('should handle multiple occurrences of the same variable', () => {
      const template = '{{projectName}} - {{projectName}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('test-extension - test-extension');
    });

    it('should leave undefined variables unchanged', () => {
      const template = 'Name: {{projectName}}, Unknown: {{unknown}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Name: test-extension, Unknown: {{unknown}}');
    });

    it('should handle empty template', () => {
      const template = '';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('');
    });

    it('should handle template with no variables', () => {
      const template = 'This is a plain text template';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('This is a plain text template');
    });
  });

  describe('conditional rendering', () => {
    it('should include block when condition is truthy', () => {
      const template = '{{#if author}}Author: {{author}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Author: Test Author');
    });

    it('should exclude block when condition is falsy', () => {
      const template = '{{#if missing}}This should not appear{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('');
    });

    it('should handle multiple conditionals', () => {
      const template = '{{#if projectName}}Name: {{projectName}}{{/if}} {{#if version}}Version: {{version}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Name: test-extension Version: 1.0.0');
    });

    it('should handle nested content in conditionals', () => {
      const template = '{{#if author}}Author: {{author}}\nDescription: {{description}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Author: Test Author\nDescription: A test extension');
    });
  });

  describe('render', () => {
    it('should render all files in a template directory', async () => {
      // Setup mock file system
      vol.fromJSON({
        '/template/file1.txt': 'Project: {{projectName}}',
        '/template/file2.txt': 'Version: {{version}}',
        '/template/subdir/file3.txt': 'Description: {{description}}',
      });

      const files = await engine.render('/template', context);

      expect(files).toHaveLength(3);
      expect(files[0].content).toBe('Project: test-extension');
      expect(files[1].content).toBe('Version: 1.0.0');
      expect(files[2].content).toBe('Description: A test extension');
    });

    it('should preserve directory structure in file paths', async () => {
      vol.fromJSON({
        '/template/root.txt': 'root',
        '/template/subdir/nested.txt': 'nested',
      });

      const files = await engine.render('/template', context);

      const paths = files.map(f => f.path);
      expect(paths).toContain('root.txt');
      expect(paths).toContain(path.join('subdir', 'nested.txt'));
    });

    it('should process filenames with variables', async () => {
      vol.fromJSON({
        '/template/{{projectName}}.txt': 'content',
      });

      const files = await engine.render('/template', context);

      expect(files[0].path).toBe('test-extension.txt');
    });

    it('should handle empty directory', async () => {
      vol.fromJSON({
        '/template/.keep': '',
      });

      // Remove the .keep file to make it truly empty
      vol.unlinkSync('/template/.keep');
      vol.mkdirSync('/template', { recursive: true });

      const files = await engine.render('/template', context);

      expect(files).toHaveLength(0);
    });
  });

  describe('mergePackageJson', () => {
    it('should merge scripts from base and template', () => {
      const basePackage = {
        scripts: {
          dev: 'vite',
          start: 'node server.js',
        },
      };

      const templatePackage = {
        scripts: {
          build: 'vite build',
          preview: 'vite preview',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        dev: 'vite',
        start: 'node server.js',
        build: 'vite build',
        preview: 'vite preview',
      });
    });

    it('should merge dependencies from base and template', () => {
      const basePackage = {
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
      };

      const templatePackage = {
        dependencies: {
          axios: '^1.0.0',
          lodash: '^4.17.21',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.dependencies).toEqual({
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        axios: '^1.0.0',
        lodash: '^4.17.21',
      });
    });

    it('should merge devDependencies from base and template', () => {
      const basePackage = {
        devDependencies: {
          'web-ext': '^8.3.0',
          concurrently: '^9.1.0',
        },
      };

      const templatePackage = {
        devDependencies: {
          '@crxjs/vite-plugin': '^2.2.1',
          vite: '^7.2.2',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.devDependencies).toEqual({
        'web-ext': '^8.3.0',
        concurrently: '^9.1.0',
        '@crxjs/vite-plugin': '^2.2.1',
        vite: '^7.2.2',
      });
    });

    it('should allow template values to override base values in scripts', () => {
      const basePackage = {
        scripts: {
          dev: 'base-dev-command',
          build: 'base-build-command',
        },
      };

      const templatePackage = {
        scripts: {
          dev: 'template-dev-command',
          test: 'vitest',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        dev: 'template-dev-command', // Template overrides base
        build: 'base-build-command',
        test: 'vitest',
      });
    });

    it('should allow template values to override base values in dependencies', () => {
      const basePackage = {
        dependencies: {
          react: '^18.0.0',
          axios: '^0.27.0',
        },
      };

      const templatePackage = {
        dependencies: {
          axios: '^1.0.0', // Different version
          lodash: '^4.17.21',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.dependencies).toEqual({
        react: '^18.0.0',
        axios: '^1.0.0', // Template version wins
        lodash: '^4.17.21',
      });
    });

    it('should allow template values to override base values in devDependencies', () => {
      const basePackage = {
        devDependencies: {
          vite: '^5.0.0',
          'web-ext': '^8.3.0',
        },
      };

      const templatePackage = {
        devDependencies: {
          vite: '^7.2.2', // Different version
          typescript: '^5.0.0',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.devDependencies).toEqual({
        vite: '^7.2.2', // Template version wins
        'web-ext': '^8.3.0',
        typescript: '^5.0.0',
      });
    });

    it('should handle empty base package', () => {
      const basePackage = {};

      const templatePackage = {
        scripts: {
          build: 'vite build',
        },
        dependencies: {
          react: '^18.0.0',
        },
        devDependencies: {
          vite: '^7.2.2',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        build: 'vite build',
      });
      expect(result.dependencies).toEqual({
        react: '^18.0.0',
      });
      expect(result.devDependencies).toEqual({
        vite: '^7.2.2',
      });
    });

    it('should handle empty template package', () => {
      const basePackage = {
        scripts: {
          dev: 'vite',
        },
        dependencies: {
          react: '^18.0.0',
        },
        devDependencies: {
          'web-ext': '^8.3.0',
        },
      };

      const templatePackage = {};

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        dev: 'vite',
      });
      expect(result.dependencies).toEqual({
        react: '^18.0.0',
      });
      expect(result.devDependencies).toEqual({
        'web-ext': '^8.3.0',
      });
    });

    it('should handle missing scripts in base package', () => {
      const basePackage = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      const templatePackage = {
        scripts: {
          build: 'vite build',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        build: 'vite build',
      });
    });

    it('should handle missing dependencies in base package', () => {
      const basePackage = {
        scripts: {
          dev: 'vite',
        },
      };

      const templatePackage = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.dependencies).toEqual({
        react: '^18.0.0',
      });
    });

    it('should handle missing devDependencies in base package', () => {
      const basePackage = {
        scripts: {
          dev: 'vite',
        },
      };

      const templatePackage = {
        devDependencies: {
          vite: '^7.2.2',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.devDependencies).toEqual({
        vite: '^7.2.2',
      });
    });

    it('should handle missing scripts in template package', () => {
      const basePackage = {
        scripts: {
          dev: 'vite',
        },
      };

      const templatePackage = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.scripts).toEqual({
        dev: 'vite',
      });
    });

    it('should handle missing dependencies in template package', () => {
      const basePackage = {
        dependencies: {
          react: '^18.0.0',
        },
      };

      const templatePackage = {
        scripts: {
          build: 'vite build',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.dependencies).toEqual({
        react: '^18.0.0',
      });
    });

    it('should handle missing devDependencies in template package', () => {
      const basePackage = {
        devDependencies: {
          'web-ext': '^8.3.0',
        },
      };

      const templatePackage = {
        scripts: {
          build: 'vite build',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result.devDependencies).toEqual({
        'web-ext': '^8.3.0',
      });
    });

    it('should merge all fields together correctly', () => {
      const basePackage = {
        name: 'base-package',
        version: '1.0.0',
        scripts: {
          dev: 'concurrently "vite" "web-ext run"',
        },
        dependencies: {
          react: '^18.0.0',
        },
        devDependencies: {
          'web-ext': '^8.3.0',
          concurrently: '^9.1.0',
        },
      };

      const templatePackage = {
        name: 'template-package',
        description: 'A Chrome extension',
        scripts: {
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          'react-dom': '^18.0.0',
        },
        devDependencies: {
          '@crxjs/vite-plugin': '^2.2.1',
          vite: '^7.2.2',
        },
      };

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result).toEqual({
        name: 'template-package', // Template overrides base
        version: '1.0.0',
        description: 'A Chrome extension',
        scripts: {
          dev: 'concurrently "vite" "web-ext run"',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
        devDependencies: {
          'web-ext': '^8.3.0',
          concurrently: '^9.1.0',
          '@crxjs/vite-plugin': '^2.2.1',
          vite: '^7.2.2',
        },
      });
    });

    it('should handle both packages being empty', () => {
      const basePackage = {};
      const templatePackage = {};

      const result = engine.mergePackageJson(basePackage, templatePackage);

      expect(result).toEqual({
        scripts: {},
        dependencies: {},
        devDependencies: {},
      });
    });
  });

  describe('mergePartialFiles', () => {
    it('should merge .gitignore.partial with template .gitignore', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '# Development profile\n.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/\ndist/',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const gitignoreFile = result.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toBe(
        'node_modules/\ndist/\n# Development profile\n.dev-profile/'
      );
    });

    it('should merge README.partial with template README', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: 'README.dev-workflow.partial.md',
          content: '## Development\n\nRun `npm run dev` to start.',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: 'README.dev-workflow.md',
          content: '# My Extension\n\nA Chrome extension.',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const readmeFile = result.find(f => f.path === 'README.dev-workflow.md');
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toBe(
        '# My Extension\n\nA Chrome extension.\n## Development\n\nRun `npm run dev` to start.'
      );
    });

    it('should append partial content correctly with newline separator', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: 'config.partial.txt',
          content: 'base-config=true',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: 'config.txt',
          content: 'template-config=true',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const configFile = result.find(f => f.path === 'config.txt');
      expect(configFile).toBeDefined();
      expect(configFile?.content).toBe('template-config=true\nbase-config=true');
    });

    it('should handle missing template file for partial', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      // Partial should be used as-is with .partial removed from name
      const gitignoreFile = result.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toBe('.dev-profile/');
    });

    it('should handle multiple partial files', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
        {
          path: 'README.partial.md',
          content: '## Dev Workflow',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/',
          encoding: 'utf-8',
        },
        {
          path: 'README.md',
          content: '# Project',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const gitignoreFile = result.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile?.content).toBe('node_modules/\n.dev-profile/');

      const readmeFile = result.find(f => f.path === 'README.md');
      expect(readmeFile?.content).toBe('# Project\n## Dev Workflow');
    });

    it('should preserve non-partial base files', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: 'web-ext-config.js',
          content: 'export default { target: "chromium" };',
          encoding: 'utf-8',
        },
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      // Non-partial base file should be included
      const webExtFile = result.find(f => f.path === 'web-ext-config.js');
      expect(webExtFile).toBeDefined();
      expect(webExtFile?.content).toBe('export default { target: "chromium" };');

      // Partial should be merged
      const gitignoreFile = result.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile?.content).toBe('node_modules/\n.dev-profile/');
    });

    it('should preserve template files that have no corresponding partial', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/',
          encoding: 'utf-8',
        },
        {
          path: 'vite.config.js',
          content: 'export default {};',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      // Template file without partial should be preserved
      const viteFile = result.find(f => f.path === 'vite.config.js');
      expect(viteFile).toBeDefined();
      expect(viteFile?.content).toBe('export default {};');
    });

    it('should handle empty base files array', () => {
      const baseFiles: TemplateFile[] = [];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('.gitignore.template');
      expect(result[0].content).toBe('node_modules/');
    });

    it('should handle empty template files array', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      // Partial should be used as-is with .partial removed
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('.gitignore.template');
      expect(result[0].content).toBe('.dev-profile/');
    });

    it('should handle both arrays being empty', () => {
      const baseFiles: TemplateFile[] = [];
      const templateFiles: TemplateFile[] = [];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      expect(result).toHaveLength(0);
    });

    it('should preserve encoding when merging files', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: '.gitignore.partial.template',
          content: '.dev-profile/',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: '.gitignore.template',
          content: 'node_modules/',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const gitignoreFile = result.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile?.encoding).toBe('utf-8');
    });

    it('should handle complex partial file names', () => {
      const baseFiles: TemplateFile[] = [
        {
          path: 'docs/README.dev.partial.md',
          content: '## Development Section',
          encoding: 'utf-8',
        },
      ];

      const templateFiles: TemplateFile[] = [
        {
          path: 'docs/README.dev.md',
          content: '# Documentation',
          encoding: 'utf-8',
        },
      ];

      const result = engine.mergePartialFiles(baseFiles, templateFiles);

      const readmeFile = result.find(f => f.path === 'docs/README.dev.md');
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toBe('# Documentation\n## Development Section');
    });
  });

  describe('renderWithInheritance', () => {
    it('should render files from base template', async () => {
      // Setup base template and empty template directory
      vol.fromJSON({
        '/base/web-ext-config.js': 'export default { target: "chromium" };',
        '/base/.gitignore.partial.template': '.dev-profile/',
        '/template/.keep': '', // Create template directory
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should include base files
      const webExtFile = files.find(f => f.path === 'web-ext-config.js');
      expect(webExtFile).toBeDefined();
      expect(webExtFile?.content).toBe('export default { target: "chromium" };');
    });

    it('should render files from specific template', async () => {
      // Setup base and template
      vol.fromJSON({
        '/base/web-ext-config.js': 'export default { target: "chromium" };',
        '/template/vite.config.js': 'export default { plugins: [] };',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should include template files
      const viteFile = files.find(f => f.path === 'vite.config.js');
      expect(viteFile).toBeDefined();
      expect(viteFile?.content).toBe('export default { plugins: [] };');
    });

    it('should handle file conflict resolution with template overriding base', async () => {
      // Setup base and template with same file
      vol.fromJSON({
        '/base/config.js': 'export default { from: "base" };',
        '/template/config.js': 'export default { from: "template" };',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Template should override base
      const configFile = files.find(f => f.path === 'config.js');
      expect(configFile).toBeDefined();
      expect(configFile?.content).toBe('export default { from: "template" };');
    });

    it('should merge package.json from base and template', async () => {
      // Setup base and template with package.json
      vol.fromJSON({
        '/base/package.json.template': JSON.stringify({
          scripts: {
            dev: 'concurrently "vite" "web-ext run"',
          },
          devDependencies: {
            'web-ext': '^8.3.0',
            concurrently: '^9.1.0',
          },
        }),
        '/template/package.json.template': JSON.stringify({
          scripts: {
            build: 'vite build',
          },
          devDependencies: {
            vite: '^7.2.2',
            '@crxjs/vite-plugin': '^2.2.1',
          },
        }),
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should merge package.json
      const packageFile = files.find(f => f.path === 'package.json.template');
      expect(packageFile).toBeDefined();
      
      const packageJson = JSON.parse(packageFile!.content);
      expect(packageJson.scripts).toEqual({
        dev: 'concurrently "vite" "web-ext run"',
        build: 'vite build',
      });
      expect(packageJson.devDependencies).toEqual({
        'web-ext': '^8.3.0',
        concurrently: '^9.1.0',
        vite: '^7.2.2',
        '@crxjs/vite-plugin': '^2.2.1',
      });
    });

    it('should merge partial files from base with template files', async () => {
      // Setup base with partial and template with target file
      vol.fromJSON({
        '/base/.gitignore.partial.template': '# Dev profile\n.dev-profile/',
        '/template/.gitignore.template': 'node_modules/\ndist/',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should merge partial into template file
      const gitignoreFile = files.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toBe('node_modules/\ndist/\n# Dev profile\n.dev-profile/');
    });

    it('should handle complete project generation with inheritance', async () => {
      // Setup realistic base and template structure
      vol.fromJSON({
        '/base/web-ext-config.js': 'export default { target: "chromium" };',
        '/base/.gitignore.partial.template': '.dev-profile/',
        '/base/README.md.partial.template': '## Development\n\nRun `npm run dev`.',
        '/base/package.json.template': JSON.stringify({
          scripts: {
            dev: 'concurrently "vite" "web-ext run"',
          },
          devDependencies: {
            'web-ext': '^8.3.0',
            concurrently: '^9.1.0',
          },
        }),
        '/template/vite.config.js': 'export default { plugins: [] };',
        '/template/manifest.json.template': JSON.stringify({
          name: '{{projectName}}',
          version: '{{version}}',
        }),
        '/template/.gitignore.template': 'node_modules/\ndist/',
        '/template/README.md.template': '# {{projectName}}\n\n{{description}}',
        '/template/package.json.template': JSON.stringify({
          scripts: {
            build: 'vite build',
          },
          devDependencies: {
            vite: '^7.2.2',
            '@crxjs/vite-plugin': '^2.2.1',
          },
        }),
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Verify all expected files are present
      expect(files.length).toBeGreaterThan(0);

      // Check base files
      const webExtFile = files.find(f => f.path === 'web-ext-config.js');
      expect(webExtFile).toBeDefined();

      // Check template files
      const viteFile = files.find(f => f.path === 'vite.config.js');
      expect(viteFile).toBeDefined();

      const manifestFile = files.find(f => f.path === 'manifest.json.template');
      expect(manifestFile).toBeDefined();
      expect(manifestFile?.content).toContain('test-extension');

      // Check merged files
      const gitignoreFile = files.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toContain('node_modules/');
      expect(gitignoreFile?.content).toContain('.dev-profile/');

      const readmeFile = files.find(f => f.path === 'README.md.template');
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('test-extension');
      expect(readmeFile?.content).toContain('npm run dev');

      const packageFile = files.find(f => f.path === 'package.json.template');
      expect(packageFile).toBeDefined();
      const packageJson = JSON.parse(packageFile!.content);
      expect(packageJson.scripts.dev).toBeDefined();
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.devDependencies['web-ext']).toBeDefined();
      expect(packageJson.devDependencies.vite).toBeDefined();
    });

    it('should render normally when no base path is provided', async () => {
      // Setup template only
      vol.fromJSON({
        '/template/vite.config.js': 'export default { plugins: [] };',
        '/template/manifest.json.template': '{"name": "{{projectName}}"}',
      });

      const files = await engine.renderWithInheritance('/template', undefined, context);

      // Should render template files normally
      expect(files).toHaveLength(2);
      const viteFile = files.find(f => f.path === 'vite.config.js');
      expect(viteFile).toBeDefined();
    });

    it('should render normally when base path does not exist', async () => {
      // Setup template only
      vol.fromJSON({
        '/template/vite.config.js': 'export default { plugins: [] };',
      });

      const files = await engine.renderWithInheritance('/template', '/nonexistent', context);

      // Should render template files normally
      expect(files).toHaveLength(1);
      const viteFile = files.find(f => f.path === 'vite.config.js');
      expect(viteFile).toBeDefined();
    });

    it('should not include partial files in final output', async () => {
      // Setup base with partial files
      vol.fromJSON({
        '/base/.gitignore.partial.template': '.dev-profile/',
        '/base/README.partial.md': '## Dev Section',
        '/template/.gitignore.template': 'node_modules/',
        '/template/README.md': '# Project',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should not have any .partial. files in output
      const partialFiles = files.filter(f => f.path.includes('.partial.'));
      expect(partialFiles).toHaveLength(0);

      // Should have merged files
      const gitignoreFile = files.find(f => f.path === '.gitignore.template');
      expect(gitignoreFile).toBeDefined();
      expect(gitignoreFile?.content).toContain('.dev-profile/');

      const readmeFile = files.find(f => f.path === 'README.md');
      expect(readmeFile).toBeDefined();
      expect(readmeFile?.content).toContain('Dev Section');
    });

    it('should handle template overriding base package.json values', async () => {
      // Setup base and template with conflicting package.json values
      vol.fromJSON({
        '/base/package.json.template': JSON.stringify({
          scripts: {
            dev: 'base-dev-command',
            start: 'base-start-command',
          },
          devDependencies: {
            vite: '^5.0.0',
            'web-ext': '^8.3.0',
          },
        }),
        '/template/package.json.template': JSON.stringify({
          scripts: {
            dev: 'template-dev-command',
            build: 'vite build',
          },
          devDependencies: {
            vite: '^7.2.2',
            typescript: '^5.0.0',
          },
        }),
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      const packageFile = files.find(f => f.path === 'package.json.template');
      expect(packageFile).toBeDefined();
      
      const packageJson = JSON.parse(packageFile!.content);
      
      // Template should override base for conflicting values
      expect(packageJson.scripts.dev).toBe('template-dev-command');
      expect(packageJson.scripts.start).toBe('base-start-command');
      expect(packageJson.scripts.build).toBe('vite build');
      
      expect(packageJson.devDependencies.vite).toBe('^7.2.2');
      expect(packageJson.devDependencies['web-ext']).toBe('^8.3.0');
      expect(packageJson.devDependencies.typescript).toBe('^5.0.0');
    });

    it('should handle invalid JSON in package.json gracefully', async () => {
      // Setup base and template with invalid JSON
      vol.fromJSON({
        '/base/package.json.template': 'invalid json {',
        '/template/package.json.template': JSON.stringify({
          scripts: {
            build: 'vite build',
          },
        }),
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Should keep template version when base JSON is invalid
      const packageFile = files.find(f => f.path === 'package.json.template');
      expect(packageFile).toBeDefined();
      expect(packageFile?.content).toBe(JSON.stringify({
        scripts: {
          build: 'vite build',
        },
      }));
    });

    it('should preserve file encoding when merging', async () => {
      // Setup base and template
      vol.fromJSON({
        '/base/web-ext-config.js': 'export default {};',
        '/base/.gitignore.partial.template': '.dev-profile/',
        '/template/.gitignore.template': 'node_modules/',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // All files should have utf-8 encoding
      for (const file of files) {
        expect(file.encoding).toBe('utf-8');
      }
    });

    it('should handle nested directory structures in both base and template', async () => {
      // Setup base and template with nested directories
      vol.fromJSON({
        '/base/config/web-ext-config.js': 'export default {};',
        '/base/docs/README.partial.md': '## Dev Docs',
        '/template/src/popup/index.html': '<html></html>',
        '/template/docs/README.md': '# Docs',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Check nested base files
      const webExtFile = files.find(f => f.path === path.join('config', 'web-ext-config.js'));
      expect(webExtFile).toBeDefined();

      // Check nested template files
      const popupFile = files.find(f => f.path === path.join('src', 'popup', 'index.html'));
      expect(popupFile).toBeDefined();

      // Check merged nested files
      const docsFile = files.find(f => f.path === path.join('docs', 'README.md'));
      expect(docsFile).toBeDefined();
      expect(docsFile?.content).toContain('Dev Docs');
    });

    it('should apply variable substitution to both base and template files', async () => {
      // Setup base and template with variables
      vol.fromJSON({
        '/base/web-ext-config.js': 'export default { name: "{{projectName}}" };',
        '/template/manifest.json.template': '{"version": "{{version}}"}',
      });

      const files = await engine.renderWithInheritance('/template', '/base', context);

      // Check variable substitution in base files
      const webExtFile = files.find(f => f.path === 'web-ext-config.js');
      expect(webExtFile?.content).toContain('test-extension');

      // Check variable substitution in template files
      const manifestFile = files.find(f => f.path === 'manifest.json.template');
      expect(manifestFile?.content).toContain('1.0.0');
    });
  });
});
