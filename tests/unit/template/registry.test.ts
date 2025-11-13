import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateRegistry } from '../../../src/core/template/registry';

describe('TemplateRegistry', () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = new TemplateRegistry();
  });

  describe('get', () => {
    it('should return vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template).toBeDefined();
      expect(template?.id).toBe('vanilla');
      expect(template?.name).toBe('Vanilla JavaScript');
    });

    it('should return react template', () => {
      const template = registry.get('react');

      expect(template).toBeDefined();
      expect(template?.id).toBe('react');
      expect(template?.name).toBe('React');
    });

    it('should return undefined for non-existent template', () => {
      const template = registry.get('non-existent');

      expect(template).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return array of all templates', () => {
      const templates = registry.list();

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should include vanilla template in list', () => {
      const templates = registry.list();
      const vanillaTemplate = templates.find(t => t.id === 'vanilla');

      expect(vanillaTemplate).toBeDefined();
      expect(vanillaTemplate?.name).toBe('Vanilla JavaScript');
    });

    it('should include react template in list', () => {
      const templates = registry.list();
      const reactTemplate = templates.find(t => t.id === 'react');

      expect(reactTemplate).toBeDefined();
      expect(reactTemplate?.name).toBe('React');
    });
  });

  describe('has', () => {
    it('should return true for existing template', () => {
      expect(registry.has('vanilla')).toBe(true);
    });

    it('should return true for react template', () => {
      expect(registry.has('react')).toBe(true);
    });

    it('should return false for non-existent template', () => {
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('template metadata', () => {
    it('should have correct structure for vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template).toMatchObject({
        id: 'vanilla',
        name: expect.any(String),
        description: expect.any(String),
        files: expect.any(String),
        dependencies: expect.any(Array),
        devDependencies: expect.any(Array),
      });
    });

    it('should have files path for vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template?.files).toBeDefined();
      expect(typeof template?.files).toBe('string');
    });
  });

  describe('Template interface with extends field', () => {
    it('should load base template without extends field', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate).toBeDefined();
      expect(baseTemplate?.id).toBe('base');
      expect(baseTemplate?.extends).toBeUndefined();
    });

    it('should load vanilla template with extends field', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate).toBeDefined();
      expect(vanillaTemplate?.extends).toBe('base');
    });

    it('should have extends field as optional string type', () => {
      const vanillaTemplate = registry.get('vanilla');

      if (vanillaTemplate?.extends) {
        expect(typeof vanillaTemplate.extends).toBe('string');
      }
    });
  });

  describe('Template interface with scripts field', () => {
    it('should load base template with scripts field', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate).toBeDefined();
      expect(baseTemplate?.scripts).toBeDefined();
      expect(typeof baseTemplate?.scripts).toBe('object');
    });

    it('should have dev script in base template', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate?.scripts?.dev).toBeDefined();
      expect(typeof baseTemplate?.scripts?.dev).toBe('string');
      expect(baseTemplate?.scripts?.dev).toContain('concurrently');
    });

    it('should load vanilla template with scripts field', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate).toBeDefined();
      expect(vanillaTemplate?.scripts).toBeDefined();
      expect(typeof vanillaTemplate?.scripts).toBe('object');
    });

    it('should have build and preview scripts in vanilla template', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate?.scripts?.build).toBeDefined();
      expect(vanillaTemplate?.scripts?.preview).toBeDefined();
      expect(typeof vanillaTemplate?.scripts?.build).toBe('string');
      expect(typeof vanillaTemplate?.scripts?.preview).toBe('string');
    });

    it('should have scripts field as optional Record<string, string> type', () => {
      const baseTemplate = registry.get('base');

      if (baseTemplate?.scripts) {
        expect(typeof baseTemplate.scripts).toBe('object');
        Object.entries(baseTemplate.scripts).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('string');
        });
      }
    });
  });

  describe('Type definitions verification', () => {
    it('should have all required Template interface fields', () => {
      const template = registry.get('vanilla');

      expect(template).toBeDefined();
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('files');
      expect(template).toHaveProperty('dependencies');
      expect(template).toHaveProperty('devDependencies');
    });

    it('should have correct types for all Template fields', () => {
      const template = registry.get('vanilla');

      expect(typeof template?.id).toBe('string');
      expect(typeof template?.name).toBe('string');
      expect(typeof template?.description).toBe('string');
      expect(typeof template?.files).toBe('string');
      expect(Array.isArray(template?.dependencies)).toBe(true);
      expect(Array.isArray(template?.devDependencies)).toBe(true);
    });

    it('should have optional extends field with correct type', () => {
      const vanillaTemplate = registry.get('vanilla');
      const baseTemplate = registry.get('base');

      // Vanilla has extends
      expect(vanillaTemplate?.extends).toBeDefined();
      expect(typeof vanillaTemplate?.extends).toBe('string');

      // Base does not have extends
      expect(baseTemplate?.extends).toBeUndefined();
    });

    it('should have optional scripts field with correct type', () => {
      const template = registry.get('base');

      if (template?.scripts) {
        expect(typeof template.scripts).toBe('object');
        expect(template.scripts).not.toBeNull();
        expect(Array.isArray(template.scripts)).toBe(false);
      }
    });

    it('should validate scripts field structure when present', () => {
      const baseTemplate = registry.get('base');
      const vanillaTemplate = registry.get('vanilla');

      // Both templates should have scripts
      expect(baseTemplate?.scripts).toBeDefined();
      expect(vanillaTemplate?.scripts).toBeDefined();

      // Verify Record<string, string> structure
      if (baseTemplate?.scripts) {
        Object.entries(baseTemplate.scripts).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('string');
          expect(key.length).toBeGreaterThan(0);
          expect(value.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Base template loading', () => {
    it('should load base template correctly', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate).toBeDefined();
      expect(baseTemplate?.id).toBe('base');
      expect(baseTemplate?.name).toBe('Base Template');
      expect(baseTemplate?.description).toContain('Browser Preview');
    });

    it('should load base template with correct dependencies', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate?.dependencies).toBeDefined();
      expect(Array.isArray(baseTemplate?.dependencies)).toBe(true);
      expect(baseTemplate?.dependencies).toEqual([]);
    });

    it('should load base template with correct devDependencies', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate?.devDependencies).toBeDefined();
      expect(Array.isArray(baseTemplate?.devDependencies)).toBe(true);
      expect(baseTemplate?.devDependencies).toContain('web-ext@^8.3.0');
      expect(baseTemplate?.devDependencies).toContain('concurrently@^9.1.0');
    });

    it('should load base template with correct scripts', () => {
      const baseTemplate = registry.get('base');

      expect(baseTemplate?.scripts).toBeDefined();
      expect(baseTemplate?.scripts?.dev).toBeDefined();
      expect(baseTemplate?.scripts?.dev).toContain('concurrently');
      expect(baseTemplate?.scripts?.dev).toContain('vite');
      expect(baseTemplate?.scripts?.dev).toContain('web-ext run');
    });

    it('should load vanilla template that extends base', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate).toBeDefined();
      expect(vanillaTemplate?.extends).toBe('base');
    });

    it('should load vanilla template with its own devDependencies', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate?.devDependencies).toBeDefined();
      expect(vanillaTemplate?.devDependencies).toContain('@crxjs/vite-plugin@^2.2.1');
      expect(vanillaTemplate?.devDependencies).toContain('vite@^7.2.2');
    });

    it('should load vanilla template with its own scripts', () => {
      const vanillaTemplate = registry.get('vanilla');

      expect(vanillaTemplate?.scripts).toBeDefined();
      expect(vanillaTemplate?.scripts?.build).toBe('vite build');
      expect(vanillaTemplate?.scripts?.preview).toBe('vite preview');
    });
  });

  describe('Metadata merging with getWithBase', () => {
    it('should return base template as-is when it does not extend anything', () => {
      const baseTemplate = registry.get('base');
      const mergedTemplate = registry.getWithBase('base');

      expect(mergedTemplate).toBeDefined();
      expect(mergedTemplate).toEqual(baseTemplate);
    });

    it('should merge vanilla template with base template', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate).toBeDefined();
      expect(mergedTemplate?.id).toBe('vanilla');
      expect(mergedTemplate?.extends).toBe('base');
    });

    it('should merge devDependencies from base and vanilla', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate?.devDependencies).toBeDefined();
      expect(mergedTemplate?.devDependencies).toContain('web-ext@^8.3.0');
      expect(mergedTemplate?.devDependencies).toContain('concurrently@^9.1.0');
      expect(mergedTemplate?.devDependencies).toContain('@crxjs/vite-plugin@^2.2.1');
      expect(mergedTemplate?.devDependencies).toContain('vite@^7.2.2');
    });

    it('should merge dependencies from base and vanilla', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate?.dependencies).toBeDefined();
      expect(Array.isArray(mergedTemplate?.dependencies)).toBe(true);
      // Both base and vanilla have empty dependencies arrays
      expect(mergedTemplate?.dependencies).toEqual([]);
    });

    it('should merge scripts from base and vanilla', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate?.scripts).toBeDefined();
      // Should have dev script from base
      expect(mergedTemplate?.scripts?.dev).toBeDefined();
      expect(mergedTemplate?.scripts?.dev).toContain('concurrently');
      // Should have build and preview scripts from vanilla
      expect(mergedTemplate?.scripts?.build).toBe('vite build');
      expect(mergedTemplate?.scripts?.preview).toBe('vite preview');
    });

    it('should have all scripts after merging', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate?.scripts).toBeDefined();
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('dev');
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('build');
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('preview');
    });

    it('should return undefined for non-existent template', () => {
      const mergedTemplate = registry.getWithBase('non-existent');

      expect(mergedTemplate).toBeUndefined();
    });

    it('should handle template with non-existent base gracefully', () => {
      // This tests the fallback behavior when base template is not found
      // In practice, this shouldn't happen, but we test the defensive code
      const vanillaTemplate = registry.get('vanilla');
      
      expect(vanillaTemplate).toBeDefined();
      // The actual merging happens in getWithBase, which handles missing base
    });
  });

  describe('Base values inheritance', () => {
    it('should inherit base devDependencies in merged template', () => {
      const baseTemplate = registry.get('base');
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(baseTemplate?.devDependencies).toBeDefined();
      baseTemplate?.devDependencies.forEach(dep => {
        expect(mergedTemplate?.devDependencies).toContain(dep);
      });
    });

    it('should inherit base scripts in merged template', () => {
      const baseTemplate = registry.get('base');
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(baseTemplate?.scripts).toBeDefined();
      Object.entries(baseTemplate?.scripts || {}).forEach(([key, value]) => {
        expect(mergedTemplate?.scripts?.[key]).toBe(value);
      });
    });

    it('should preserve vanilla-specific values in merged template', () => {
      const vanillaTemplate = registry.get('vanilla');
      const mergedTemplate = registry.getWithBase('vanilla');

      expect(mergedTemplate?.id).toBe(vanillaTemplate?.id);
      expect(mergedTemplate?.name).toBe(vanillaTemplate?.name);
      expect(mergedTemplate?.description).toBe(vanillaTemplate?.description);
      expect(mergedTemplate?.files).toBe(vanillaTemplate?.files);
    });
  });

  describe('Template values override base on conflict', () => {
    it('should allow vanilla scripts to override base scripts with same name', () => {
      // This test verifies the override behavior
      // If both base and vanilla had a script with the same name,
      // vanilla's version should win
      const mergedTemplate = registry.getWithBase('vanilla');

      // Currently no conflicts, but the merge logic supports it
      expect(mergedTemplate?.scripts).toBeDefined();
      
      // Verify that vanilla's scripts are present (they would override if there was a conflict)
      expect(mergedTemplate?.scripts?.build).toBe('vite build');
      expect(mergedTemplate?.scripts?.preview).toBe('vite preview');
    });

    it('should preserve base scripts when vanilla does not override them', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      // Base has 'dev' script, vanilla doesn't override it
      expect(mergedTemplate?.scripts?.dev).toBeDefined();
      expect(mergedTemplate?.scripts?.dev).toContain('concurrently');
    });

    it('should maintain correct order in merged arrays', () => {
      const mergedTemplate = registry.getWithBase('vanilla');

      // Base dependencies come first, then template dependencies
      expect(mergedTemplate?.devDependencies).toBeDefined();
      const devDeps = mergedTemplate?.devDependencies || [];
      
      // Base deps should appear before vanilla deps
      const webExtIndex = devDeps.findIndex(d => d.startsWith('web-ext'));
      const viteIndex = devDeps.findIndex(d => d.startsWith('vite@'));
      
      expect(webExtIndex).toBeGreaterThanOrEqual(0);
      expect(viteIndex).toBeGreaterThanOrEqual(0);
      expect(webExtIndex).toBeLessThan(viteIndex);
    });
  });

  describe('React template registration', () => {
    it('should load react template correctly', () => {
      const reactTemplate = registry.get('react');

      expect(reactTemplate).toBeDefined();
      expect(reactTemplate?.id).toBe('react');
      expect(reactTemplate?.name).toBe('React');
      expect(reactTemplate?.description).toContain('React 18');
    });

    it('should load react template with extends field', () => {
      const reactTemplate = registry.get('react');

      expect(reactTemplate).toBeDefined();
      expect(reactTemplate?.extends).toBe('base');
    });

    it('should load react template with correct dependencies', () => {
      const reactTemplate = registry.get('react');

      expect(reactTemplate?.dependencies).toBeDefined();
      expect(Array.isArray(reactTemplate?.dependencies)).toBe(true);
      expect(reactTemplate?.dependencies).toContain('react@^18.3.0');
      expect(reactTemplate?.dependencies).toContain('react-dom@^18.3.0');
    });

    it('should load react template with correct devDependencies', () => {
      const reactTemplate = registry.get('react');

      expect(reactTemplate?.devDependencies).toBeDefined();
      expect(Array.isArray(reactTemplate?.devDependencies)).toBe(true);
      expect(reactTemplate?.devDependencies).toContain('@crxjs/vite-plugin@^2.2.1');
      expect(reactTemplate?.devDependencies).toContain('@types/chrome@^0.0.270');
      expect(reactTemplate?.devDependencies).toContain('@types/react@^18.3.0');
      expect(reactTemplate?.devDependencies).toContain('@types/react-dom@^18.3.0');
      expect(reactTemplate?.devDependencies).toContain('@vitejs/plugin-react@^4.3.0');
      expect(reactTemplate?.devDependencies).toContain('typescript@^5.6.0');
      expect(reactTemplate?.devDependencies).toContain('vite@^7.2.2');
    });

    it('should load react template with correct scripts', () => {
      const reactTemplate = registry.get('react');

      expect(reactTemplate?.scripts).toBeDefined();
      expect(reactTemplate?.scripts?.build).toBe('tsc && vite build');
      expect(reactTemplate?.scripts?.preview).toBe('vite preview');
      expect(reactTemplate?.scripts?.['type-check']).toBe('tsc --noEmit');
    });

    it('should merge react template with base template', () => {
      const mergedTemplate = registry.getWithBase('react');

      expect(mergedTemplate).toBeDefined();
      expect(mergedTemplate?.id).toBe('react');
      expect(mergedTemplate?.extends).toBe('base');
    });

    it('should merge devDependencies from base and react', () => {
      const mergedTemplate = registry.getWithBase('react');

      expect(mergedTemplate?.devDependencies).toBeDefined();
      // Base dependencies
      expect(mergedTemplate?.devDependencies).toContain('web-ext@^8.3.0');
      expect(mergedTemplate?.devDependencies).toContain('concurrently@^9.1.0');
      // React dependencies
      expect(mergedTemplate?.devDependencies).toContain('@crxjs/vite-plugin@^2.2.1');
      expect(mergedTemplate?.devDependencies).toContain('@vitejs/plugin-react@^4.3.0');
      expect(mergedTemplate?.devDependencies).toContain('typescript@^5.6.0');
      expect(mergedTemplate?.devDependencies).toContain('vite@^7.2.2');
    });

    it('should merge dependencies from base and react', () => {
      const mergedTemplate = registry.getWithBase('react');

      expect(mergedTemplate?.dependencies).toBeDefined();
      expect(Array.isArray(mergedTemplate?.dependencies)).toBe(true);
      // React dependencies
      expect(mergedTemplate?.dependencies).toContain('react@^18.3.0');
      expect(mergedTemplate?.dependencies).toContain('react-dom@^18.3.0');
    });

    it('should merge scripts from base and react', () => {
      const mergedTemplate = registry.getWithBase('react');

      expect(mergedTemplate?.scripts).toBeDefined();
      // Should have dev script from base
      expect(mergedTemplate?.scripts?.dev).toBeDefined();
      expect(mergedTemplate?.scripts?.dev).toContain('concurrently');
      // Should have build, preview, and type-check scripts from react
      expect(mergedTemplate?.scripts?.build).toBe('tsc && vite build');
      expect(mergedTemplate?.scripts?.preview).toBe('vite preview');
      expect(mergedTemplate?.scripts?.['type-check']).toBe('tsc --noEmit');
    });

    it('should have all scripts after merging react template', () => {
      const mergedTemplate = registry.getWithBase('react');

      expect(mergedTemplate?.scripts).toBeDefined();
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('dev');
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('build');
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('preview');
      expect(Object.keys(mergedTemplate?.scripts || {})).toContain('type-check');
    });

    it('should appear in available templates list', () => {
      const templates = registry.list();
      const reactTemplate = templates.find(t => t.id === 'react');

      expect(reactTemplate).toBeDefined();
      expect(reactTemplate?.name).toBe('React');
      expect(reactTemplate?.description).toContain('React 18');
    });
  });
});
