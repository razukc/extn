# Implementation Plan

- [x] 1. Create Vue template directory structure





  - Create `src/templates/vue/` directory
  - Create `src/templates/vue/files/` directory for template files
  - Create subdirectories: `files/src/`, `files/public/`, `files/public/icons/`
  - _Requirements: 4.1, 4.2_

- [x] 2. Create template configuration file





  - Write `src/templates/vue/template.json` with base extension
  - Define Vue 3 dependency (^3.5.0)
  - Define TypeScript and type definition devDependencies
  - Define @vitejs/plugin-vue and @crxjs/vite-plugin devDependencies
  - Define vue-tsc for Vue TypeScript checking
  - Define build, preview, and type-check scripts
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Create TypeScript configuration





  - Write `src/templates/vue/files/tsconfig.json`
  - Configure module resolution to "bundler" for Vite
  - Configure strict mode and linting options
  - Configure to recognize .vue file extensions
  - Configure path aliases (@/* to ./src/*)
  - Include src/**/*.ts and src/**/*.vue files
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [x] 4. Create Vite configuration




  - Write `src/templates/vue/files/vite.config.ts.template`
  - Configure @vitejs/plugin-vue for Vue SFC support
  - Configure @crxjs/vite-plugin for Chrome extension builds
  - Configure build output directory and source maps
  - Configure path aliases matching tsconfig.json
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 5. Create manifest template





  - Write `src/templates/vue/files/manifest.template.json`
  - Configure popup with TypeScript entry point
  - Configure background service worker with TypeScript
  - Configure content scripts with Vue entry point
  - Add web_accessible_resources for content script assets
  - Include template variables ({{projectName}}, {{version}}, {{description}})
  - _Requirements: 4.5_

- [x] 6. Create popup component files




- [x] 6.1 Create popup HTML entry point





  - Write `src/templates/vue/files/src/popup/popup.html`
  - Add app div element for Vue mounting
  - Add script tag loading main.ts
  - _Requirements: 4.2_
-

- [x] 6.2 Create popup Vue component




  - Write `src/templates/vue/files/src/popup/Popup.vue`
  - Implement ref for count management with Composition API
  - Implement onMounted for chrome.storage.local integration
  - Implement onMounted for chrome.tabs.query integration
  - Add increment button with chrome.storage.local.set
  - Add scoped styles for popup layout
  - _Requirements: 4.2, 5.3_

- [x] 6.3 Create popup entry point





  - Write `src/templates/vue/files/src/popup/main.ts`
  - Import createApp from Vue
  - Import Popup component
  - Create and mount Vue app to #app element
  - _Requirements: 4.2, 4.3_

- [x] 7. Create content script component files




- [x] 7.1 Create content script Vue component


  - Write `src/templates/vue/files/src/content/Content.vue`
  - Implement ref for visibility toggle
  - Create fixed position overlay with scoped styles
  - Add close button functionality
  - _Requirements: 4.2_



- [ ] 7.2 Create content script entry point
  - Write `src/templates/vue/files/src/content/main.ts`
  - Create container div and append to document.body
  - Create and mount Vue app to container
  - _Requirements: 4.2, 4.3_

- [x] 8. Create background service worker





  - Write `src/templates/vue/files/src/background/background.ts`
  - Implement chrome.runtime.onInstalled listener with storage initialization
  - Implement chrome.runtime.onMessage listener with message handling
  - Implement chrome.tabs.onUpdated listener for tab tracking
  - _Requirements: 4.2_

- [x] 9. Create Chrome API type definitions





  - Write `src/templates/vue/files/src/types/chrome.d.ts`
  - Add type augmentations for chrome.storage Promise-based APIs
  - Add type definitions for common Chrome API patterns
  - _Requirements: 6.3_

- [x] 10. Create package.json template





  - Write `src/templates/vue/files/package.json.template`
  - Include template variables ({{projectName}}, {{version}}, {{description}})
  - Define type: "module" for ES modules
  - Define build, preview, and type-check scripts
  - Define Vue 3 dependency
  - Define TypeScript, Vite, and vue-tsc devDependencies
  - _Requirements: 1.4, 2.1, 2.2, 2.3, 2.4, 3.3, 3.4_

- [x] 11. Create .gitignore template





  - Write `src/templates/vue/files/.gitignore.template`
  - Add node_modules/, dist/, .vscode/ entries
  - Add TypeScript build artifacts (*.tsbuildinfo)
  - Add log files and OS-specific files
  - _Requirements: 7.4_

- [x] 12. Create README template




  - Write `src/templates/vue/files/README.md.template`
  - Document project overview and features
  - Document installation and build instructions
  - Document project structure
  - Document available npm scripts
  - Include template variables ({{projectName}})
  - _Requirements: 7.1, 7.5, 10.1_

- [x] 13. Create icon placeholder files




  - Create `src/templates/vue/files/public/icons/` directory
  - Copy icon files from vanilla template (icon16.png, icon48.png, icon128.png)
  - _Requirements: 4.4_

- [x] 14. Register Vue template in registry





  - Update template registry to include Vue template
  - Verify template loading with base extension
  - Verify template appears in available templates list
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 15. Verify template inheritance and file merging






- [x] 15.1 Test package.json merging

  - Create test project with Vue template
  - Verify dev script is inherited from base template
  - Verify web-ext and concurrently dependencies are included
  - Verify Vue-specific scripts and dependencies are included
  - _Requirements: 1.1, 1.4, 1.5_


- [x] 15.2 Test .gitignore merging

  - Verify Vue-specific entries are included
  - Verify proper spacing between template and partial content
  - _Requirements: 7.1, 7.4_

- [x] 15.3 Test README merging


  - Verify Vue-specific content is included
  - Verify dev workflow documentation from base partial is appended
  - Verify proper formatting and spacing
  - _Requirements: 7.2, 7.5, 10.5_



- [ ] 15.4 Test web-ext-config.mjs inheritance
  - Verify web-ext-config.mjs is copied from base template
  - Verify file works without modification for Vue template
  - _Requirements: 1.3, 8.1_

- [-] 16. Integration testing




- [x] 16.1 Test project creation

  - Run `extn create test-vue-extension --template vue`
  - Verify all files are generated correctly
  - Verify directory structure matches design
  - _Requirements: 9.1_


- [x] 16.2 Test TypeScript compilation


  - Run `npm install` in generated project
  - Run `npm run type-check` and verify no errors
  - Verify TypeScript recognizes Vue and Chrome API types
  - _Requirements: 2.5, 6.2, 6.3_


- [x] 16.3 Test Vite build

  - Run `npm run build` in generated project
  - Verify dist/ directory is created with correct structure
  - Verify manifest.json is generated correctly
  - Verify all entry points are bundled
  - _Requirements: 3.3, 3.5_


- [x] 16.4 Test development workflow

  - Run `npm run dev` in generated project
  - Verify Vite dev server starts
  - Verify Chrome launches with extension loaded
  - Verify HMR works when modifying Vue components
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 16.5 Test extension functionality in Chrome
  - Load generated extension in Chrome
  - Test popup opens and displays correctly
  - Test count increment functionality with chrome.storage
  - Test content script injection on web pages
  - Test background service worker console logs
  - _Requirements: 10.2_

- [x] 17. Update documentation





  - Add Vue template to main README.md template list
  - Update template-inheritance.md with Vue example
  - Document Vue-specific features and usage
  - _Requirements: 9.3, 10.1_

- [x] 18. Add testing setup








  - Add @vue/test-utils and vitest to devDependencies
  - Create vitest.config.ts for Vue testing
  - Create example test file for Popup component
  - Add test and test:ui scripts to package.json
  - _Requirements: None (enhancement)_
