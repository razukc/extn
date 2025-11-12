#!/usr/bin/env node

/**
 * Verification script for template inheritance system
 * 
 * This script verifies that:
 * - Base template loads correctly
 * - Vanilla template extends base
 * - Package.json merges correctly
 * - Partial files merge correctly
 * - web-ext-config.js comes from base
 */

import { TemplateRegistry } from '../../dist/core/template/registry.js';
import { TemplateEngine } from '../../dist/core/template/engine.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

async function verifyTemplateInheritance() {
  let passed = 0;
  let failed = 0;

  logInfo('Starting template inheritance verification...\n');

  try {
    const registry = new TemplateRegistry();
    const engine = new TemplateEngine();

    // Test 1: Verify base template loads correctly
    logInfo('Test 1: Verify base template loads correctly');
    const baseTemplate = registry.get('base');
    
    if (!baseTemplate) {
      logError('Base template not found');
      failed++;
    } else if (baseTemplate.id !== 'base') {
      logError(`Base template has wrong id: ${baseTemplate.id}`);
      failed++;
    } else if (!baseTemplate.name.includes('Base')) {
      logError(`Base template has wrong name: ${baseTemplate.name}`);
      failed++;
    } else if (!baseTemplate.description.includes('Browser Preview')) {
      logError(`Base template description missing 'Browser Preview': ${baseTemplate.description}`);
      failed++;
    } else {
      logSuccess('Base template loads correctly');
      passed++;
    }

    // Test 2: Verify vanilla template extends base
    logInfo('Test 2: Verify vanilla template extends base');
    const vanillaTemplate = registry.get('vanilla');
    
    if (!vanillaTemplate) {
      logError('Vanilla template not found');
      failed++;
    } else if (vanillaTemplate.extends !== 'base') {
      logError(`Vanilla template does not extend base: ${vanillaTemplate.extends}`);
      failed++;
    } else {
      logSuccess('Vanilla template extends base');
      passed++;
    }

    // Test 3: Verify package.json merges correctly
    logInfo('Test 3: Verify package.json merges correctly');
    const mergedTemplate = registry.getWithBase('vanilla');
    
    if (!mergedTemplate) {
      logError('Failed to get merged template');
      failed++;
    } else {
      // Check devDependencies merge
      const hasWebExt = mergedTemplate.devDependencies?.includes('web-ext@^8.3.0');
      const hasConcurrently = mergedTemplate.devDependencies?.includes('concurrently@^9.1.0');
      const hasVite = mergedTemplate.devDependencies?.includes('vite@^7.2.2');
      const hasCrxjs = mergedTemplate.devDependencies?.includes('@crxjs/vite-plugin@^2.2.1');

      if (!hasWebExt || !hasConcurrently || !hasVite || !hasCrxjs) {
        logError('Package.json devDependencies not merged correctly');
        logError(`  web-ext: ${hasWebExt}, concurrently: ${hasConcurrently}, vite: ${hasVite}, @crxjs: ${hasCrxjs}`);
        failed++;
      } else {
        logSuccess('Package.json devDependencies merged correctly');
        passed++;
      }

      // Check scripts merge
      const hasDevScript = mergedTemplate.scripts?.dev?.includes('concurrently');
      const hasBuildScript = mergedTemplate.scripts?.build === 'vite build';
      const hasPreviewScript = mergedTemplate.scripts?.preview === 'vite preview';

      if (!hasDevScript || !hasBuildScript || !hasPreviewScript) {
        logError('Package.json scripts not merged correctly');
        logError(`  dev: ${hasDevScript}, build: ${hasBuildScript}, preview: ${hasPreviewScript}`);
        failed++;
      } else {
        logSuccess('Package.json scripts merged correctly');
        passed++;
      }
    }

    // Test 4: Verify partial files merge correctly
    logInfo('Test 4: Verify partial files merge correctly');
    
    // Get base template path
    const baseTemplatePath = path.join(__dirname, '../../src/templates/base/files');
    const vanillaTemplatePath = path.join(__dirname, '../../src/templates/vanilla/files');
    
    try {
      // Render both templates
      const baseFiles = await engine.render(baseTemplatePath, {
        projectName: 'test-project',
        version: '1.0.0',
        description: 'Test',
        author: 'Test',
      });

      const vanillaFiles = await engine.render(vanillaTemplatePath, {
        projectName: 'test-project',
        version: '1.0.0',
        description: 'Test',
        author: 'Test',
      });

      // Merge partial files
      const mergedFiles = engine.mergePartialFiles(baseFiles, vanillaFiles);

      // Check for .gitignore merge
      const gitignoreFile = mergedFiles.find(f => f.path === '.gitignore.template');
      if (!gitignoreFile) {
        logError('.gitignore.template not found in merged files');
        failed++;
      } else if (!gitignoreFile.content.includes('.dev-profile/')) {
        logError('.gitignore does not include .dev-profile/ from base partial');
        failed++;
      } else if (!gitignoreFile.content.includes('node_modules/')) {
        logError('.gitignore does not include node_modules/ from vanilla');
        failed++;
      } else {
        logSuccess('Partial files merge correctly (.gitignore)');
        passed++;
      }

      // Check for README merge
      const readmeFile = mergedFiles.find(f => f.path === 'README.md.template');
      if (!readmeFile) {
        logError('README.md.template not found in merged files');
        failed++;
      } else if (!readmeFile.content.includes('npm run dev')) {
        logError('README does not include dev workflow from base partial');
        failed++;
      } else if (!readmeFile.content.includes('test-project')) {
        logError('README does not include project name from vanilla');
        failed++;
      } else {
        logSuccess('Partial files merge correctly (README)');
        passed++;
      }
    } catch (error) {
      logError(`Failed to test partial file merging: ${error.message}`);
      failed++;
    }

    // Test 5: Verify web-ext-config.js comes from base
    logInfo('Test 5: Verify web-ext-config.js comes from base');
    
    try {
      const baseTemplatePath = path.join(__dirname, '../../src/templates/base/files');
      const baseFiles = await engine.render(baseTemplatePath, {
        projectName: 'test-project',
        version: '1.0.0',
        description: 'Test',
        author: 'Test',
      });

      const webExtFile = baseFiles.find(f => f.path === 'web-ext-config.js');
      if (!webExtFile) {
        logError('web-ext-config.js not found in base template');
        failed++;
      } else if (!webExtFile.content.includes('sourceDir')) {
        logError('web-ext-config.js missing sourceDir configuration');
        failed++;
      } else if (!webExtFile.content.includes('./dist')) {
        logError('web-ext-config.js not pointing to ./dist');
        failed++;
      } else if (!webExtFile.content.includes('chromium')) {
        logError('web-ext-config.js not targeting chromium');
        failed++;
      } else if (!webExtFile.content.includes('.dev-profile')) {
        logError('web-ext-config.js not using .dev-profile');
        failed++;
      } else {
        logSuccess('web-ext-config.js comes from base with correct configuration');
        passed++;
      }
    } catch (error) {
      logError(`Failed to verify web-ext-config.js: ${error.message}`);
      failed++;
    }

    // Summary
    console.log('');
    log('═'.repeat(60), colors.blue);
    logInfo(`Verification Summary:`);
    logSuccess(`Passed: ${passed}`);
    if (failed > 0) {
      logError(`Failed: ${failed}`);
    }
    log('═'.repeat(60), colors.blue);

    if (failed === 0) {
      console.log('');
      logSuccess('All template inheritance tests passed! ✨');
      process.exit(0);
    } else {
      console.log('');
      logError('Some template inheritance tests failed.');
      process.exit(1);
    }

  } catch (error) {
    logError(`Verification failed with error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run verification
verifyTemplateInheritance();
