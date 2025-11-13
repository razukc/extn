#!/usr/bin/env node

/**
 * Verification script for React extension build output
 * Checks that all required files exist and are properly configured
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'test-react-extension/dist';
const REQUIRED_FILES = [
  'manifest.json',
  'service-worker-loader.js',
  'src/popup/popup.html',
  'public/icons/icon16.png',
  'public/icons/icon48.png',
  'public/icons/icon128.png',
];

const REQUIRED_DIRS = [
  'src/popup',
  'src/content',
  'public/icons',
  'assets',
];

console.log('🔍 Verifying React Extension Build Output\n');
console.log(`Build Directory: ${DIST_DIR}\n`);

let hasErrors = false;

// Check if dist directory exists
if (!existsSync(DIST_DIR)) {
  console.error('❌ ERROR: dist directory does not exist');
  console.error('   Run: cd test-react-extension && npm run build');
  process.exit(1);
}

// Check required files
console.log('📄 Checking Required Files:');
for (const file of REQUIRED_FILES) {
  const filePath = join(DIST_DIR, file);
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    hasErrors = true;
  }
}

// Check required directories
console.log('\n📁 Checking Required Directories:');
for (const dir of REQUIRED_DIRS) {
  const dirPath = join(DIST_DIR, dir);
  if (existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ - MISSING`);
    hasErrors = true;
  }
}

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
  const manifestPath = join(DIST_DIR, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const checks = [
    {
      name: 'Manifest version 3',
      pass: manifest.manifest_version === 3,
    },
    {
      name: 'Has name',
      pass: !!manifest.name,
    },
    {
      name: 'Has version',
      pass: !!manifest.version,
    },
    {
      name: 'Has popup configured',
      pass: !!manifest.action?.default_popup,
    },
    {
      name: 'Has background service worker',
      pass: !!manifest.background?.service_worker,
    },
    {
      name: 'Has content scripts',
      pass: Array.isArray(manifest.content_scripts) && manifest.content_scripts.length > 0,
    },
    {
      name: 'Has storage permission',
      pass: manifest.permissions?.includes('storage'),
    },
    {
      name: 'Has tabs permission',
      pass: manifest.permissions?.includes('tabs'),
    },
  ];

  for (const check of checks) {
    if (check.pass) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - FAILED`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.log(`   ❌ Failed to parse manifest.json: ${error.message}`);
  hasErrors = true;
}

// Check popup HTML
console.log('\n🎨 Checking Popup HTML:');
try {
  const popupPath = join(DIST_DIR, 'src/popup/popup.html');
  const popupHtml = readFileSync(popupPath, 'utf-8');

  const checks = [
    {
      name: 'Has root div',
      pass: popupHtml.includes('id="root"'),
    },
    {
      name: 'Has script tag',
      pass: popupHtml.includes('<script'),
    },
  ];

  for (const check of checks) {
    if (check.pass) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - FAILED`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.log(`   ❌ Failed to read popup.html: ${error.message}`);
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VERIFICATION FAILED');
  console.log('\nThe extension build has issues that need to be fixed.');
  console.log('Please review the errors above and rebuild the extension.');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASSED');
  console.log('\nThe extension is ready for manual testing in Chrome!');
  console.log('\nNext Steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log(`4. Select the ${DIST_DIR} directory`);
  console.log('5. Follow the manual testing guide in docs/testing/REACT_EXTENSION_MANUAL_TEST.md');
  process.exit(0);
}
