# Requirements Document

## Introduction

This document defines the requirements for adding Vue template support to extn. The Vue template will extend the base template to inherit Browser Preview features while providing a modern Vue 3 development experience with TypeScript, hot module replacement, and Chrome extension-specific configurations. The template will follow the established template inheritance pattern used by the React and vanilla templates, ensuring consistency across all framework templates.

## Glossary

- **extn**: The CLI tool for building Chrome extensions with modern tooling
- **Template System**: The inheritance-based system that allows templates to extend a base template and share common features
- **Base Template**: The foundational template containing shared Browser Preview features (web-ext, concurrently, dev workflow)
- **Vue Template**: A new template that extends the base template to provide Vue-specific development features
- **Template Engine**: The component responsible for rendering template files and merging configurations
- **Template Registry**: The component that manages template loading and inheritance resolution
- **Browser Preview**: The development feature that automatically launches Chrome with the extension loaded
- **HMR**: Hot Module Replacement - the ability to update code in the browser without full page reload
- **@crxjs/vite-plugin**: The Vite plugin that enables Chrome extension development with modern build tools
- **Manifest V3**: The current Chrome extension manifest specification
- **SFC**: Single File Component - Vue's component format that combines template, script, and style in one file
- **Composition API**: Vue 3's modern API for organizing component logic

## Requirements

### Requirement 1: Template Inheritance

**User Story:** As a developer, I want the Vue template to inherit Browser Preview features from the base template, so that I have a consistent development workflow across all framework templates.

#### Acceptance Criteria

1. WHEN the Template Registry loads the Vue template, THE Template Registry SHALL resolve the base template dependency and merge configurations
2. THE Vue Template SHALL extend the base template by declaring "extends": "base" in its template.json configuration
3. THE Vue Template SHALL inherit the dev script, web-ext dependency, concurrently dependency, and web-ext-config.mjs file from the base template
4. WHEN package.json files are merged, THE Template Engine SHALL combine base and Vue-specific scripts without conflicts
5. WHEN package.json files are merged, THE Template Engine SHALL combine base and Vue-specific dependencies with Vue versions taking precedence on conflicts

### Requirement 2: Vue Framework Integration

**User Story:** As a developer, I want to use Vue 3 with TypeScript for building Chrome extensions, so that I can leverage modern Vue features and type safety.

#### Acceptance Criteria

1. THE Vue Template SHALL include Vue 3.x as a runtime dependency
2. THE Vue Template SHALL include TypeScript 5.x as a development dependency
3. THE Vue Template SHALL include @vitejs/plugin-vue as a development dependency for Vue SFC support in Vite
4. THE Vue Template SHALL include vue-tsc as a development dependency for Vue TypeScript type checking
5. THE Vue Template SHALL provide a tsconfig.json file configured for Vue development with appropriate compiler options

### Requirement 3: Build Configuration

**User Story:** As a developer, I want a properly configured build system, so that my Vue code compiles correctly for Chrome extensions.

#### Acceptance Criteria

1. THE Vue Template SHALL provide a vite.config.js file that configures @crxjs/vite-plugin for Chrome extension builds
2. THE Vue Template SHALL provide a vite.config.js file that configures @vitejs/plugin-vue for Vue SFC compilation
3. THE Vue Template SHALL include a build script that runs Vue TypeScript compilation followed by Vite build
4. THE Vue Template SHALL include a type-check script that validates TypeScript types without emitting files
5. THE Vue Template SHALL configure Vite to output extension files to the dist directory

### Requirement 4: Project Structure

**User Story:** As a developer, I want a well-organized project structure, so that I can easily locate and modify extension components.

#### Acceptance Criteria

1. THE Vue Template SHALL create a src directory containing Vue component files
2. THE Vue Template SHALL provide a popup component as an example Vue SFC component
3. THE Vue Template SHALL provide an entry point file that creates and mounts the Vue application
4. THE Vue Template SHALL include a public directory for static assets like icons
5. THE Vue Template SHALL provide a manifest.json template configured for Vue-based popup and content scripts

### Requirement 5: Development Experience

**User Story:** As a developer, I want hot module replacement during development, so that I can see changes instantly without manual reloads.

#### Acceptance Criteria

1. WHEN the developer runs npm run dev, THE Vue Template SHALL start Vite dev server with HMR enabled
2. WHEN the developer runs npm run dev, THE Vue Template SHALL launch Chrome with the extension loaded via inherited base template functionality
3. WHEN the developer modifies Vue component files, THE Vite Dev Server SHALL update the browser without full page reload
4. THE Vue Template SHALL include the inherited dev workflow documentation from the base template

### Requirement 6: TypeScript Configuration

**User Story:** As a developer, I want proper TypeScript configuration, so that I have type safety and IDE support for Vue and Chrome extension APIs.

#### Acceptance Criteria

1. THE Vue Template SHALL configure TypeScript with module resolution set to "bundler" for Vite compatibility
2. THE Vue Template SHALL configure TypeScript with strict mode enabled for maximum type safety
3. THE Vue Template SHALL include @types/chrome for Chrome extension API type definitions
4. THE Vue Template SHALL configure TypeScript to recognize .vue file extensions
5. THE Vue Template SHALL configure TypeScript to target ES2020 for modern JavaScript features

### Requirement 7: Template File Merging

**User Story:** As a developer, I want the generated project to include both base and Vue-specific files, so that I have all necessary configuration and documentation.

#### Acceptance Criteria

1. WHEN the Template Engine generates a project, THE Template Engine SHALL merge the base .gitignore.partial.template with the Vue .gitignore.template
2. WHEN the Template Engine generates a project, THE Template Engine SHALL merge the base README.partial.md.template with the Vue README.md.template
3. WHEN the Template Engine generates a project, THE Template Engine SHALL copy the web-ext-config.mjs file from the base template
4. THE Vue Template SHALL provide template-specific .gitignore entries for node_modules, dist, and TypeScript build artifacts
5. THE Vue Template SHALL provide template-specific README content describing Vue-specific features and commands

### Requirement 8: Shared Components with Other Framework Templates

**User Story:** As a template maintainer, I want to identify components that can be shared between React, Vue, and Svelte templates, so that we minimize duplication and maintain consistency.

#### Acceptance Criteria

1. THE Base Template SHALL provide web-ext-config.mjs that works for all framework templates without modification
2. THE Base Template SHALL provide the dev script pattern that works for all framework templates using Vite
3. THE Base Template SHALL provide .gitignore.partial.template entries that apply to all framework templates
4. THE Base Template SHALL provide README.partial.md.template with dev workflow documentation that applies to all framework templates
5. WHERE a framework template uses Vite and @crxjs/vite-plugin, THE Template SHALL be compatible with the base template's dev script without modification

### Requirement 9: Template Registration

**User Story:** As a user, I want to create a Vue-based Chrome extension using the CLI, so that I can quickly start development with my preferred framework.

#### Acceptance Criteria

1. WHEN the user runs "extn create my-extension --template vue", THE CLI SHALL create a new project using the Vue template
2. THE Template Registry SHALL list the Vue template as an available option when users query available templates
3. THE Vue Template SHALL appear in help documentation with its name and description
4. WHEN the Template Registry loads templates, THE Template Registry SHALL validate that the Vue template's base dependency exists
5. THE CLI SHALL display an error message with clear guidance if the Vue template cannot be loaded due to missing base template

### Requirement 10: Documentation and Examples

**User Story:** As a developer, I want clear documentation and working examples, so that I can understand how to build Chrome extensions with Vue.

#### Acceptance Criteria

1. THE Vue Template SHALL provide a README.md that explains the project structure and available npm scripts
2. THE Vue Template SHALL include example Vue components that demonstrate Chrome extension API usage
3. THE Vue Template SHALL document how to add new popup pages, content scripts, or background scripts
4. THE Vue Template SHALL include comments in configuration files explaining key settings
5. THE Vue Template SHALL reference the inherited Browser Preview documentation from the base template
