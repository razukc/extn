# Implementation Plan

- [x] 1. Create base template structure





  - [x] 1.1 Create base template directory and metadata


    - Create directory `src/templates/base/`
    - Create `src/templates/base/template.json` with base metadata
    - Define id as "base"
    - Add web-ext and concurrently to devDependencies
    - Define dev script pattern in scripts section
    - _Requirements: 1.1, 8.5_

  - [x] 1.2 Create web-ext-config.mjs in base template
    - Create new file at `src/templates/base/files/web-ext-config.mjs`
    - Configure sourceDir to point to ./dist
    - Set startUrl to chrome://extensions in run section
    - Configure ignoreFiles to exclude build config files
    - Use web-ext default temporary profile behavior
    - _Requirements: 1.2, 2.1, 2.2, 4.1, 5.1, 5.2, 5.3_

  - [x] 1.3 Write unit test for web-ext-config.js validity
    - Test that config file is valid JavaScript
    - Verify all required fields are present
    - Test that config can be imported
    - _Requirements: 1.1_

  - [x] 1.4 Create partial .gitignore in base template


    - Create `src/templates/base/files/.gitignore.partial.template`
    - Leave empty (reserved for future shared patterns)
    - _Requirements: 2.3, 7.3_

  - [x] 1.5 Create partial README in base template


    - Create `src/templates/base/files/README.partial.md.template`
    - Document npm run dev command
    - Explain dev workflow steps (without profile persistence)
    - Add configuration section for web-ext-config.mjs
    - Add troubleshooting section
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.1, 9.2, 9.3, 9.4, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Implement template inheritance system






  - [x] 2.1 Update Template interface in registry.ts


    - Add optional extends field to Template interface
    - Add optional scripts field to Template interface
    - Update type definitions
    - _Requirements: 8.1, 8.5_

  - [x] 2.2 Implement base template loading in registry.ts


    - Update loadTemplates() to load base template
    - Implement getWithBase() method to resolve template with base
    - Merge metadata from base and specific template
    - Handle extends field in template.json
    - _Requirements: 8.1, 8.5_

  - [x] 2.3 Implement package.json merging in engine.ts


    - Add mergePackageJson() method to TemplateEngine
    - Merge scripts from base and template
    - Merge dependencies from base and template
    - Merge devDependencies from base and template
    - Template-specific values override base on conflict
    - _Requirements: 8.1, 8.5_

  - [x] 2.4 Implement partial file merging in engine.ts


    - Add mergePartialFiles() method to TemplateEngine
    - Detect .partial files in base template
    - Merge .gitignore.partial with template .gitignore
    - Merge README.partial with template README
    - Append partial content to template files
    - _Requirements: 8.1, 8.5_

  - [x] 2.5 Update render() method to support inheritance





    - Render files from base template first
    - Render files from specific template second
    - Apply merging logic for package.json and partials
    - Handle file conflicts (template overrides base)
    - _Requirements: 8.1, 8.4, 8.5_

- [x] 3. Update vanilla template to extend base


  - [x] 3.1 Update vanilla template.json to extend base




    - Add "extends": "base" field to template.json
    - Remove web-ext and concurrently from devDependencies (now in base)
    - Keep @crxjs/vite-plugin and vite in devDependencies
    - Add scripts section with build and preview scripts
    - Remove dev script (now inherited from base)
    - _Requirements: 8.1, 8.5_

  - [x] 3.2 Move web-ext-config.js from vanilla to base




    - Delete `src/templates/vanilla/files/web-ext-config.js`
    - Verify file exists in base template
    - Update any references in tests
    - _Requirements: 1.1_

  - [x] 3.3 Update vanilla package.json.template





    - Remove web-ext and concurrently (now in base)
    - Remove dev script (now in base)
    - Keep vanilla-specific dependencies
    - Keep build and preview scripts
    - Note: Will be merged with base at generation time
    - _Requirements: 8.1, 8.5_

  - [x] 3.4 Update vanilla .gitignore.template




    - Keep existing vanilla-specific ignore patterns
    - Note: Will be merged with base partial at generation time (if base partial has content)
    - _Requirements: 2.3, 7.3_

  - [x] 3.5 Update vanilla README.md.template



    - Keep vanilla-specific documentation
    - Remove dev workflow section (now in base partial)
    - Add placeholder comment where base partial will be inserted
    - Note: Will be merged with base partial at generation time
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.1, 9.2, 9.3, 9.4_

- [ ] 4. Write unit tests for template inheritance
  - [x] 4.1 Write unit tests for Template interface updates



    - Test Template interface with extends field
    - Test Template interface with scripts field
    - Verify type definitions are correct
    - _Requirements: 8.1_

  - [x] 4.2 Write unit tests for base template loading




    - Test that base template loads correctly
    - Test that vanilla template extends base
    - Test metadata merging (dependencies, scripts)
    - Verify base values are inherited
    - Verify template values override base on conflict
    - _Requirements: 8.1, 8.5_

  - [x] 4.3 Write unit tests for package.json merging




    - Test merging scripts from base and template
    - Test merging dependencies from base and template
    - Test merging devDependencies from base and template
    - Test that template values override base
    - Test with empty base or template
    - _Requirements: 8.1, 8.5_

  - [x] 4.4 Write unit tests for partial file merging




    - Test .gitignore.partial merging
    - Test README.partial merging
    - Test that partial content is appended correctly
    - Test with missing partial files
    - _Requirements: 8.1, 8.5_

  - [x] 4.5 Write unit tests for render() with inheritance




    - Test rendering files from base template
    - Test rendering files from specific template
    - Test file conflict resolution (template overrides base)
    - Test complete project generation with inheritance
    - _Requirements: 8.1, 8.4, 8.5_

- [ ] 5. Write integration tests for template generation
  - [x] 5.1 Write integration test for project creation with inheritance





    - Test extn create generates project with base + vanilla files
    - Verify web-ext-config.mjs is present (from base)
    - Verify package.json has merged dependencies (base + vanilla)
    - Verify package.json has merged scripts (base + vanilla)
    - Verify README includes dev workflow documentation (from base partial)
    - _Requirements: 1.1, 8.5_

  - [x] 5.2 Write integration test for dependency installation





    - Create test project with vanilla template
    - Run npm install
    - Verify web-ext and concurrently are installed (from base)
    - Verify vite and @crxjs/vite-plugin are installed (from vanilla)
    - Verify no installation errors
    - _Requirements: 1.1_

  - [x] 5.3 Write integration test for build process





    - Create test project with vanilla template
    - Run npm install
    - Run npm run build
    - Verify dist/ directory is created
    - Verify extension files are in dist/
    - _Requirements: 8.1, 8.3, 8.4_

- [ ] 6. Manual testing and validation
  - [x] 6.1 Test template inheritance





    - Verify base template loads correctly
    - Verify vanilla template extends base
    - Verify package.json merges correctly
    - Verify partial files merge correctly
    - Verify web-ext-config.js comes from base
    - _Requirements: 8.1, 8.5_

  - [x] 6.2 Test complete workflow on Windows





    - Run extn create test-project
    - Verify all files generated (base + vanilla)
    - Run npm install
    - Run npm run dev
    - Verify browser launches with extension
    - Verify HMR works on file changes
    - Verify profile persists after restart
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 6.3 Test complete workflow on macOS



    - Run extn create test-project
    - Verify all files generated (base + vanilla)
    - Run npm install
    - Run npm run dev
    - Verify browser launches with extension
    - Verify HMR works on file changes
    - Verify profile persists after restart
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 6.4 Test complete workflow on Linux




    - Run extn create test-project
    - Verify all files generated (base + vanilla)
    - Run npm install
    - Run npm run dev
    - Verify browser launches with extension
    - Verify HMR works on file changes
    - Verify profile persists after restart
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 6.5 Test error scenarios





    - Test behavior when browser not found
    - Test behavior when port is in use
    - Test behavior with invalid manifest
    - Verify error messages are helpful
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 7. Update documentation






  - [x] 7.1 Update main extn CLI README

    - Add dev workflow to Quick Start section
    - Document that generated projects include dev workflow
    - Add example of running npm run dev
    - Mention browser auto-launch and HMR
    - Document template inheritance architecture
    - Explain that all templates get Browser Preview features
    - _Requirements: 6.1, 6.2, 6.3, 6.4_


  - [x] 7.2 Update CHANGELOG

    - Add template inheritance system as new feature
    - Add dev workflow as new feature
    - Document new base template
    - Document new template files (web-ext-config.js)
    - List new dependencies in generated projects
    - Mention profile persistence feature
    - _Requirements: 1.1_


  - [x] 7.3 Create template inheritance documentation

    - Document how template inheritance works
    - Explain base template structure
    - Document how to create new templates that extend base
    - Explain file merging rules (package.json, partials)
    - Provide examples of extending base template
    - _Requirements: 8.1, 8.5_


  - [x] 7.4 Create troubleshooting guide

    - Document common issues and solutions
    - Add browser installation links
    - Explain profile management
    - Include configuration examples
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
