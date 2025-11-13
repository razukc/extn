# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1](https://github.com/razukc/extn/compare/v0.2.0...v0.2.1) (2025-11-13)

### Documentation

* add documentation files to repository ([0cf4c8b](https://github.com/razukc/extn/commit/0cf4c8bb3cdcef7a2e4746a58513e0b789403170))
* create comprehensive documentation audit for v0.2.1 ([9f6d6f4](https://github.com/razukc/extn/commit/9f6d6f4977daf38fa762532c58ef9320f38d0cb0))
* fix web-ext-config file extension references ([717716b](https://github.com/razukc/extn/commit/717716b51354fec1edd3429370305c231eaba0c5))
* remove references to persistent profile feature ([4ae6330](https://github.com/razukc/extn/commit/4ae6330356cf2c40e17d0dbcd81576cb17533323))

## [0.2.0](https://github.com/razukc/extn/compare/v0.1.3...v0.2.0) (2025-11-12)

### Features

* add Browser Preview workflow and template inheritance system ([a387dc1](https://github.com/razukc/extn/commit/a387dc161cb7572a0defe2707fe65f715f1843fb))

## [Unreleased]

### Documentation

- Removed references to persistent profile feature (`.dev-profile/`) which was not implemented
- Simplified Browser Preview documentation to focus on actual features
- Updated template files to remove profile-related content

### Planned for v0.2.1

- Fix `web-ext-config.js` → `web-ext-config.mjs` references throughout documentation
- Update directory structure diagrams to match actual generated projects
- Comprehensive documentation review and accuracy verification
- See `docs/reports/DOCUMENTATION_AUDIT_v0.2.1.md` for details

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
