import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

describe('web-ext-config.mjs template', () => {
  const configPath = path.join(
    process.cwd(),
    'src/templates/base/files/web-ext-config.mjs'
  );

  it('should be valid JavaScript', async () => {
    expect(fs.existsSync(configPath)).toBe(true);

    // Import the config file to verify it's valid JavaScript
    const config = await import(configPath);
    expect(config).toBeDefined();
    expect(config.default).toBeDefined();
  });

  it('should have all required fields', async () => {
    const config = await import(configPath);
    const configObj = config.default;

    // Verify required fields are present
    expect(configObj).toHaveProperty('sourceDir');
    expect(configObj).toHaveProperty('ignoreFiles');
    expect(configObj).toHaveProperty('verbose');
    expect(configObj).toHaveProperty('run');
    expect(configObj.run).toHaveProperty('startUrl');
  });

  it('should have correct field values', async () => {
    const config = await import(configPath);
    const configObj = config.default;

    // Verify field values match requirements
    expect(configObj.sourceDir).toBe('./dist');
    expect(configObj.run.startUrl).toEqual(['chrome://extensions']);
    expect(configObj.ignoreFiles).toBeInstanceOf(Array);
    expect(configObj.ignoreFiles).toContain('web-ext-config.mjs');
    expect(configObj.ignoreFiles).toContain('vite.config.js');
    expect(configObj.ignoreFiles).toContain('tsconfig.json');
    expect(configObj.verbose).toBe(false);
  });

  it('should export a valid configuration object', async () => {
    const config = await import(configPath);
    const configObj = config.default;

    // Verify it's an object
    expect(typeof configObj).toBe('object');
    expect(configObj).not.toBeNull();
    expect(Array.isArray(configObj)).toBe(false);
  });
});
