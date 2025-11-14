# extn

A TypeScript-based CLI for building Chrome Manifest V3 extensions with modern tooling. Scaffold production-ready Chrome extensions with sensible defaults, TypeScript support, and a modern build pipeline powered by Vite.

## Features

- 🚀 Quick project scaffolding with `create` command
- 📦 Manifest V3 generation and validation
- 🔧 Vite-powered build system with HMR
- 🌐 **Browser Preview** - Auto-launch Chrome with your extension loaded
- 🔄 **Hot Module Replacement** - See changes instantly without manual reload
- ✅ TypeScript-first development experience
- 🎨 Multiple templates: Vanilla JavaScript, React, and Vue (Svelte coming soon)
- 🔍 Comprehensive manifest validation with helpful error messages
- 🌐 Cross-platform support (Windows, macOS, Linux)

## Installation

Install globally:

```bash
npm install -g extn
```

Or use with npx (no installation required):

```bash
npx extn create my-extension
```

## Quick Start

Create a new Chrome extension in seconds:

```bash
# Create a new extension
extn create my-extension

# Navigate to the project
cd my-extension

# Install dependencies
npm install

# Start development with Browser Preview
npm run dev
```

That's it! The `npm run dev` command will:
- ✨ Build your extension with Vite
- 🚀 Automatically launch Chrome with your extension loaded
- 🔧 Open DevTools for debugging
- 🔄 Auto-reload on file changes (HMR)

No more manual "Load unpacked" workflow - just code and see your changes instantly!

### Manual Loading (Optional)

If you prefer to load the extension manually:

1. Run `npm run build` to create the `dist` folder
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `dist` folder from your project

## Commands

### `create <project-name>`

Create a new Chrome extension project with a complete file structure, manifest, and build configuration.

**Usage:**

```bash
extn create my-extension
extn create my-extension --template vanilla
extn create my-extension --directory ./projects
```

**Options:**

- `-t, --template <name>` - Template to use (default: `vanilla`)
  - `vanilla` - Plain JavaScript/TypeScript template
  - `react` - React 18 with TypeScript and modern tooling
  - `vue` - Vue 3 with TypeScript and Composition API
- `-d, --directory <path>` - Target directory (default: `./<project-name>`)

**Examples:**

```bash
# Create with default settings (vanilla template)
extn create my-extension

# Create with React template
extn create my-extension --template react

# Create with Vue template
extn create my-extension --template vue

# Create in a specific directory
extn create my-extension --directory ~/projects

# Combine options
extn create my-react-extension --template react --directory ~/projects
```

**What gets created:**

```
my-extension/
├── src/
│   ├── popup/
│   │   ├── popup.html      # Extension popup UI
│   │   ├── popup.js        # Popup logic
│   │   └── styles.css      # Popup styles
│   ├── background/
│   │   └── background.js   # Service worker
│   └── content/
│       └── content.js      # Content script
├── public/
│   └── icons/              # Extension icons (16, 48, 128)
├── manifest.json           # Chrome extension manifest (V3)
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
├── web-ext-config.mjs      # Browser development configuration
└── tsconfig.json           # TypeScript configuration
```

### `--version`

Display the current version of extn.

```bash
extn --version
```

### `--help`

Display help information for all commands.

```bash
extn --help
extn create --help
```

## Generated Project Structure

Projects created with extn include:

- **Manifest V3** - Valid Chrome extension manifest with all required fields
- **Vite Build System** - Fast development server with HMR and optimized production builds
- **TypeScript Support** - Full TypeScript configuration (optional to use)
- **Example Code** - Working popup, background service worker, and content script
- **Icons** - Placeholder icons in required sizes (16x16, 48x48, 128x128)

### React Template Features

When using the React template (`--template react`), you also get:

- **React 19** - Latest React with modern hooks and concurrent features
- **TypeScript** - Strict type checking for React components and Chrome APIs
- **Modern JSX Transform** - No need to import React in every file
- **React Components** - Example popup and content script as React components
- **Error Boundaries** - Built-in error handling for React components
- **Testing Setup** - Vitest with React Testing Library pre-configured
- **Type Definitions** - Full type support for Chrome extension APIs

### Vue Template Features

When using the Vue template (`--template vue`), you also get:

- **Vue 3** - Latest Vue with Composition API and `<script setup>` syntax
- **TypeScript** - Strict type checking for Vue components and Chrome APIs
- **Single File Components** - Vue SFC format with template, script, and style
- **Vue Components** - Example popup and content script as Vue components
- **Hot Module Replacement** - Instant updates during development
- **Testing Setup** - Vitest with Vue Test Utils pre-configured
- **Type Definitions** - Full type support for Chrome extension APIs

## Development Workflow

After creating a project:

```bash
# Install dependencies
npm install

# Start development with Browser Preview
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Browser Preview Development Mode

The `npm run dev` command provides a complete development experience:

**What happens:**
1. 🔨 Vite builds your extension to `dist/`
2. 🚀 Chrome automatically launches with your extension loaded
3. 🔧 DevTools open automatically for debugging
4. 📍 Browser navigates to `chrome://extensions` to show your extension

**Features:**
- ⚡ **Instant HMR** - Changes to popup, options, and content scripts update without reload
- 🔄 **Smart Reload** - Manifest and background changes trigger full extension reload
- 🐛 **DevTools Ready** - Console and debugger open automatically
- 📝 **TypeScript Support** - Full type checking during development

**Customization:**

Edit `web-ext-config.mjs` in your project to customize:
- Browser target (Chrome, Firefox, Edge)
- Profile location
- Start URLs
- Browser launch options

### Production Build

The `npm run build` command creates an optimized extension in the `dist/` folder:

- 📦 Minified JavaScript bundles
- 🗜️ Optimized assets
- ✅ Validated manifest
- 🚀 Ready for Chrome Web Store submission

## Template Architecture

All templates generated by extn include Browser Preview features through a **template inheritance system**:

```
Base Template (Browser Preview)
├── web-ext configuration
├── dev script with auto-launch
└── development workflow

↓ Extended by ↓

Vanilla Template              React Template              Vue Template
├── Vite configuration       ├── Vite + React config    ├── Vite + Vue config
├── Basic extension          ├── React 19 + TypeScript  ├── Vue 3 + TypeScript
└── Vanilla JavaScript       ├── Modern JSX transform   ├── Composition API
                             └── React components       └── Vue SFC components

(Svelte template coming soon - all will include Browser Preview)
```

**What this means for you:**
- 🎯 Every template type gets Browser Preview automatically
- 🔧 Framework-specific features stay separate from dev workflow
- 📦 Consistent development experience across all templates
- ⚛️ Choose your preferred framework (Vanilla, React or Vue)
- 🚀 Future templates will inherit Browser Preview features

## Troubleshooting

### Extension doesn't load in Chrome

**Problem:** Chrome shows "Manifest file is missing or unreadable"

**Solution:**
- Make sure you've run `npm run build` first
- Load the `dist` folder, not the project root
- Check that `manifest.json` exists in the `dist` folder

### Build fails with "Cannot find module"

**Problem:** Missing dependencies after creating a project

**Solution:**
```bash
cd your-project
npm install
```

### Popup doesn't display

**Problem:** Clicking the extension icon does nothing

**Solution:**
- Check browser console for errors (F12)
- Verify `popup.html` exists in `dist/src/popup/`
- Check manifest.json has correct `action.default_popup` path
- Reload the extension in `chrome://extensions`

### Content script not injecting

**Problem:** Content script doesn't run on web pages

**Solution:**
- Check `manifest.json` has correct `content_scripts.matches` patterns
- Verify the match pattern includes the test page URL
- Reload the extension and refresh the web page
- Check browser console for errors

### TypeScript errors during build

**Problem:** Build fails with TypeScript type errors

**Solution:**
- Check `tsconfig.json` configuration
- Run `npm install` to ensure all type definitions are installed
- Verify all imports use correct paths
- Check for syntax errors in `.ts` files

### Permission denied errors

**Problem:** Cannot create project directory

**Solution:**
- Check you have write permissions in the target directory
- Try running with appropriate permissions
- Specify a different directory with `--directory` flag

### Vite dev server won't start

**Problem:** `npm run dev` fails or port is in use

**Solution:**
- Check if another process is using port 5173
- Kill the process or specify a different port in `vite.config.js`
- Check for syntax errors in `vite.config.js`

### Browser doesn't launch automatically

**Problem:** `npm run dev` builds successfully but browser doesn't open

**Solution:**
- Ensure Chrome/Chromium is installed on your system
- Check that `web-ext` can find your browser binary
- Try specifying a custom browser path in `web-ext-config.mjs`
- On Linux, ensure Chrome is in your PATH

### Extension doesn't reload on changes

**Problem:** File changes don't trigger extension reload

**Solution:**
- Check that Vite dev server is running (should see output in terminal)
- Verify the file you're editing is in the `src/` directory
- For manifest changes, expect a full extension reload (not HMR)
- Check browser console for HMR connection errors

### Dev profile issues

**Problem:** Extension state is lost between sessions

**Solution:**
- Restart the dev server (`npm run dev`)
- Check the browser console for errors
- Try rebuilding: `npm run build && npm run dev`

## Releasing

For maintainers:
- **Quick Start**: [3-minute setup guide](docs/RELEASE_QUICK_START.md)
- **Full Guide**: [Complete release documentation](docs/RELEASING.md)
- **Setup Details**: [Configuration reference](docs/RELEASE_IT_SETUP.md)

## Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/extn.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

### Development Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Link for local testing
npm link

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Testing Your Changes

```bash
# Build the CLI
npm run build

# Test the create command
npm link
extn create test-extension
cd test-extension
npm install
npm run build
```

### Code Quality Standards

- **Test Coverage:** Maintain 80%+ overall coverage (90%+ for core logic)
- **TypeScript:** Use strict mode, avoid `any` types
- **Linting:** Pass ESLint checks (`npm run lint`)
- **Formatting:** Use Prettier (`npm run format`)
- **Tests:** Add tests for new features

### Submitting Changes

1. Ensure all tests pass: `npm test`
2. Ensure code is formatted: `npm run format`
3. Ensure no lint errors: `npm run lint`
4. Commit with clear message: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature/your-feature`
6. Open a Pull Request with description of changes

### Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Build/tooling changes

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

MIT © extn

## Support

- 🐛 [Report a bug](https://github.com/razukc/extn/issues)
- 💡 [Request a feature](https://github.com/razukc/extn/issues)
- 📖 [Read the docs](https://github.com/razukc/extn#readme)
