# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0](https://github.com/razukc/extn/compare/v0.1.3...v0.2.0) (2025-11-12)

### Features

* add Browser Preview workflow and template inheritance system ([a387dc1](https://github.com/razukc/extn/commit/a387dc161cb7572a0defe2707fe65f715f1843fb))

## [Unreleased]

### Features

#### Browser Preview Development Workflow

- **Auto-Launch Browser**: `npm run dev` now automatically launches Chrome with your extension loaded
- **Hot Module Replacement**: Changes to popup, options, and content scripts update instantly without manual reload
- **Persistent Dev Profile**: Browser profile persists in `.dev-profile/` directory, keeping your settings and test data between sessions
- **DevTools Ready**: Browser opens with DevTools automatically for immediate debugging
- **Smart Reload**: Manifest and background service worker changes trigger full extension reload

#### Template Inheritance System

- **Base Template Architecture**: Introduced shared base template containing Browser Preview features
- **Template Inheritance**: All templates (vanilla, and future React/Vue/Svelte) automatically extend base template
- **Automatic Feature Propagation**: Browser Preview features are automatically included in all template types
- **Package.json Merging**: Base and template-specific dependencies/scripts are intelligently merged
- **Partial File Merging**: `.gitignore` and `README` files merge base and template-specific content

#### New Template Files

- **web-ext-config.mjs**: Browser launch configuration (target, profile, DevTools, start URLs)
- **.dev-profile/**: Persistent browser profile directory (automatically gitignored)
- **Enhanced README**: Development workflow documentation included in all generated projects
- **Updated .gitignore**: Automatically excludes `.dev-profile/` directory

#### New Dependencies in Generated Projects

- **web-ext** (^8.3.0): Mozilla's CLI tool for browser automation and extension loading
- **concurrently** (^9.1.0): Run Vite dev server and web-ext simultaneously

### Technical Improvements

- Template registry now supports `extends` field for template inheritance
- Template engine implements package.json merging logic
- Template engine implements partial file merging for `.gitignore` and `README`
- Cross-platform browser detection and launching (Windows, macOS, Linux)
- Profile persistence across development sessions

### Documentation

- Updated main README with Browser Preview workflow
- Added template inheritance architecture documentation (`docs/template-inheritance.md`)
- Added comprehensive troubleshooting guide (`docs/BROWSER_PREVIEW_TROUBLESHOOTING.md`)
- Enhanced troubleshooting section with browser-specific issues
- Added configuration examples for `web-ext-config.mjs`

## [0.1.3](https://github.com/razukc/extn/compare/v0.1.2...v0.1.3) (2025-11-10)

## [0.1.2](https://github.com/razukc/extn/compare/v0.1.1...v0.1.2) (2025-11-10)

### Bug Fixes

* add type="module" to popup.html script tag to resolve Vite bundling warning ([66bc8fb](https://github.com/razukc/extn/commit/66bc8fba8e6ff5be3b1f3d8d0dbdc44edb9c428e))

## 0.1.1 (2025-11-10)

## 0.1.1 (2025-11-10)

## [0.1.0] - 2024-01-01

### Features

- Initial release of extn
- Project scaffolding with `create` command
- Basic build pipeline with `build` command
- Manifest V3 validation
- TypeScript-first development experience
- Vanilla JavaScript template support
