# React Template Design Document

## Overview

The React template extends the base template to provide a modern React development experience for Chrome extensions. It leverages the template inheritance system to automatically include Browser Preview features while adding React-specific configurations, TypeScript support, and example components. The design follows the established pattern used by the vanilla template, ensuring consistency and maintainability.

### Key Design Principles

1. **Inheritance-First**: Leverage base template for all shared features
2. **TypeScript-Native**: Full type safety for React and Chrome APIs
3. **Modern React**: Use React 18 with hooks and functional components
4. **Minimal Configuration**: Sensible defaults with clear override paths
5. **Framework Consistency**: Share patterns with future Vue/Svelte templates

## Architecture

### Template Inheritance Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Base Template                             │
│  - web-ext-config.mjs                                        │
│  - dev script (Vite + web-ext)                               │
│  - web-ext + concurrently dependencies                       │
│  - .gitignore.partial (dev profile)                          │
│  - README.partial (dev workflow docs)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Template                             │
│  - React 18 + React DOM                                      │
│  - TypeScript 5 + type definitions                           │
│  - @vitejs/plugin-react                                      │
│  - @crxjs/vite-plugin                                        │
│  - vite.config.ts (React + CRX plugins)                      │
│  - tsconfig.json (React JSX config)                          │
│  - React component structure                                 │
│  - Example popup/content/background                          │
└─────────────────────────────────────────────────────────────┘
```


### Component Diagram

```
React Template Files
├── template.json                    # Template metadata with base extension
├── files/
│   ├── package.json.template        # React deps (merged with base)
│   ├── tsconfig.json                # TypeScript config for React
│   ├── vite.config.ts.template      # Vite + React + CRX plugins
│   ├── manifest.template.json       # Manifest V3 with React entry points
│   ├── .gitignore.template          # React-specific ignores (merged with base)
│   ├── README.md.template           # React docs (merged with base)
│   ├── public/
│   │   └── icons/                   # Extension icons (16, 48, 128)
│   └── src/
│       ├── popup/
│       │   ├── Popup.tsx            # Main popup component
│       │   ├── popup.html           # HTML entry point
│       │   └── index.tsx            # React render entry
│       ├── content/
│       │   ├── Content.tsx          # Content script component
│       │   └── index.tsx            # Content script entry
│       ├── background/
│       │   └── background.ts        # Service worker
│       └── types/
│           └── chrome.d.ts          # Chrome API type augmentations
```

## Components and Interfaces

### Template Configuration (template.json)

```json
{
  "id": "react",
  "name": "React",
  "description": "Chrome extension with React 18 and TypeScript",
  "extends": "base",
  "dependencies": [
    "react@^18.3.0",
    "react-dom@^18.3.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "@types/chrome@^0.0.270",
    "@types/react@^18.3.0",
    "@types/react-dom@^18.3.0",
    "@vitejs/plugin-react@^4.3.0",
    "typescript@^5.6.0",
    "vite@^7.2.2"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

**Design Decisions:**
- Extends "base" to inherit Browser Preview features
- React 18.3+ for latest features and performance
- TypeScript 5.6+ for modern type system features
- Separate type-check script for CI/CD integration
- Build script runs TypeScript first to catch type errors early


### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**Design Decisions:**
- `jsx: "react-jsx"` - Modern React JSX transform (no React import needed)
- `moduleResolution: "bundler"` - Vite-compatible module resolution
- `strict: true` - Maximum type safety
- `noEmit: true` - TypeScript for type checking only, Vite handles compilation
- Path aliases for cleaner imports (`@/` maps to `src/`)

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**Design Decisions:**
- React plugin first for JSX transformation
- CRX plugin second to handle extension-specific bundling
- Source maps enabled for debugging
- Path alias matches tsconfig.json
- No explicit input configuration - @crxjs/vite-plugin handles entry points from manifest


### Manifest Configuration (manifest.template.json)

```json
{
  "manifest_version": 3,
  "name": "{{projectName}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": {
      "16": "public/icons/icon16.png",
      "48": "public/icons/icon48.png",
      "128": "public/icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "src/background/background.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/index.tsx"]
    }
  ],
  "icons": {
    "16": "public/icons/icon16.png",
    "48": "public/icons/icon48.png",
    "128": "public/icons/icon128.png"
  },
  "permissions": [
    "storage",
    "tabs"
  ],
  "web_accessible_resources": [
    {
      "resources": ["src/content/index.tsx"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

**Design Decisions:**
- TypeScript file extensions (.ts, .tsx) - @crxjs/vite-plugin handles compilation
- Content script as React component for UI injection
- web_accessible_resources for content script assets
- Standard permissions (storage, tabs) as examples
- Popup HTML entry point loads React app

## Data Models

### Project Structure Model

```typescript
interface ReactTemplateStructure {
  config: {
    typescript: 'tsconfig.json';
    vite: 'vite.config.ts';
    manifest: 'manifest.json';
  };
  source: {
    popup: {
      component: 'src/popup/Popup.tsx';
      entry: 'src/popup/index.tsx';
      html: 'src/popup/popup.html';
    };
    content: {
      component: 'src/content/Content.tsx';
      entry: 'src/content/index.tsx';
    };
    background: {
      worker: 'src/background/background.ts';
    };
    types: {
      chrome: 'src/types/chrome.d.ts';
    };
  };
  assets: {
    icons: 'public/icons/';
  };
}
```


### Component Examples

#### Popup Component (src/popup/Popup.tsx)

```tsx
import { useState, useEffect } from 'react';

export function Popup() {
  const [count, setCount] = useState(0);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    // Load saved count from storage
    chrome.storage.local.get(['count'], (result) => {
      if (result.count) setCount(result.count);
    });

    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentTab(tabs[0]);
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <h1>{{projectName}}</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      {currentTab && (
        <p>Current tab: {currentTab.title}</p>
      )}
    </div>
  );
}
```

#### Popup Entry Point (src/popup/index.tsx)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from './Popup';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
```

#### Popup HTML (src/popup/popup.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
```

#### Content Script Component (src/content/Content.tsx)

```tsx
import { useState } from 'react';

export function Content() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 10000,
      }}
    >
      <p>Extension loaded!</p>
      <button onClick={() => setVisible(false)}>Close</button>
    </div>
  );
}
```


#### Content Script Entry Point (src/content/index.tsx)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Content } from './Content';

// Create a container for the React app
const container = document.createElement('div');
container.id = 'extn-react-content';
document.body.appendChild(container);

// Render the React component
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
);
```

#### Background Service Worker (src/background/background.ts)

```typescript
// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage
  chrome.storage.local.set({ count: 0 });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  sendResponse({ status: 'ok' });
  return true;
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});
```

## Error Handling

### TypeScript Type Safety

**Strategy**: Leverage TypeScript's type system to catch errors at compile time.

```typescript
// Chrome API type augmentation (src/types/chrome.d.ts)
declare namespace chrome.storage {
  interface StorageArea {
    get(keys: string[]): Promise<{ [key: string]: any }>;
    set(items: { [key: string]: any }): Promise<void>;
  }
}

// Usage with type safety
const result = await chrome.storage.local.get(['count']);
const count: number = result.count ?? 0;
```

### Runtime Error Boundaries

**Strategy**: Use React Error Boundaries to catch and handle component errors gracefully.

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```


### Chrome API Error Handling

**Strategy**: Wrap Chrome API calls with proper error handling and fallbacks.

```typescript
// Utility for safe Chrome API calls
async function safeChromeStorage<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Chrome storage error:', error);
    return fallback;
  }
}

// Usage
const count = await safeChromeStorage(
  async () => {
    const result = await chrome.storage.local.get(['count']);
    return result.count ?? 0;
  },
  0
);
```

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Scope**: Test React components in isolation

```typescript
// Example: src/popup/__tests__/Popup.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popup } from '../Popup';

// Mock Chrome API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
  },
} as any;

describe('Popup', () => {
  it('renders the popup component', () => {
    render(<Popup />);
    expect(screen.getByText(/{{projectName}}/i)).toBeInTheDocument();
  });

  it('increments count on button click', async () => {
    render(<Popup />);
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ count: 1 });
  });
});
```

**Test Configuration**: Add to template's package.json

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "vitest": "^1.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Integration Testing

**Scope**: Test Chrome extension integration with web-ext

**Approach**: Manual testing with Browser Preview feature

1. Run `npm run dev` to launch extension in Chrome
2. Test popup functionality
3. Test content script injection
4. Test background service worker
5. Verify HMR updates work correctly


## Shared Components Analysis

### Components Shared with Vue and Svelte Templates

The following components from the base template work universally for all Vite-based framework templates:

#### 1. web-ext-config.mjs

**Shared**: ✅ Yes - Framework agnostic

```javascript
export default {
  sourceDir: './dist',
  run: {
    target: ['chromium'],
    startUrl: ['https://example.com'],
  },
};
```

**Why it's shared**: Configuration is purely about browser behavior, not framework-specific.

#### 2. Dev Script Pattern

**Shared**: ✅ Yes - Works for all Vite-based frameworks

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --target chromium --source-dir=./dist --config=./web-ext-config.mjs\""
  }
}
```

**Why it's shared**: All frameworks (React, Vue, Svelte) use Vite as the dev server.

#### 3. .gitignore.partial.template

**Shared**: ✅ Yes - Framework agnostic

**Why it's shared**: Standard development artifacts are the same regardless of framework.

#### 4. README.partial.md.template

**Shared**: ✅ Yes - Framework agnostic

```markdown
## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will automatically launch Chrome with your extension loaded.
```

**Why it's shared**: Dev workflow is identical across frameworks.

#### 5. Dependencies

**Shared**: ✅ Yes - Framework agnostic

```json
{
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0"
  }
}
```

**Why it's shared**: Browser tooling is independent of UI framework.

### Framework-Specific Components

The following components are unique to each framework template:

#### React-Specific

- `@vitejs/plugin-react` - JSX transformation
- `react` + `react-dom` - Framework runtime
- `@types/react` + `@types/react-dom` - Type definitions
- `tsconfig.json` with `"jsx": "react-jsx"`
- `.tsx` file extensions
- React component patterns (hooks, functional components)

#### Vue-Specific (Future)

- `@vitejs/plugin-vue` - SFC compilation
- `vue` - Framework runtime
- `vue-tsc` - Vue TypeScript compiler
- `tsconfig.json` with Vue-specific settings
- `.vue` file extensions
- Vue component patterns (Composition API, SFC)

#### Svelte-Specific (Future)

- `@sveltejs/vite-plugin-svelte` - Svelte compilation
- `svelte` - Framework runtime
- `svelte-check` - Svelte TypeScript checker
- `tsconfig.json` with Svelte-specific settings
- `.svelte` file extensions
- Svelte component patterns (reactive declarations, stores)


## Template File Merging Design

### Package.json Merging

**Process**: Base and React package.json files are merged by the Template Engine.

**Base package.json.template**:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --target chromium --source-dir=./dist --config=./web-ext-config.mjs\""
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0"
  }
}
```

**React package.json.template**:
```json
{
  "name": "{{projectName}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "@types/chrome": "^0.0.270",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^7.2.2"
  }
}
```

**Merged Result**:
```json
{
  "name": "{{projectName}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --target chromium --source-dir=./dist --config=./web-ext-config.mjs\"",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0",
    "@crxjs/vite-plugin": "^2.2.1",
    "@types/chrome": "^0.0.270",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^7.2.2"
  }
}
```

### .gitignore Merging

**Process**: Base partial is appended to React template file.

**React .gitignore.template**:
```
node_modules/
dist/
.vscode/
*.log
.DS_Store
```

**Base .gitignore.partial.template**:
```
# (No additional entries from base template)
```

**Merged Result**:
```
node_modules/
dist/
.vscode/
*.log
.DS_Store
```


### README Merging

**Process**: Base partial is appended to React template file.

**React README.md.template**:
```markdown
# {{projectName}}

A Chrome extension built with React and TypeScript.

## Features

- React 18 with TypeScript
- Hot Module Replacement (HMR)
- Chrome Extension Manifest V3
- Vite build system

## Getting Started

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Build for production:

\`\`\`bash
npm run build
\`\`\`

Type check:

\`\`\`bash
npm run type-check
\`\`\`

## Project Structure

- `src/popup/` - Extension popup UI
- `src/content/` - Content scripts
- `src/background/` - Background service worker
- `public/icons/` - Extension icons
```

**Base README.partial.md.template**:
```markdown
## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will:
1. Start Vite dev server with HMR
2. Launch Chrome with your extension loaded
3. Auto-reload on file changes
```

**Merged Result**: React content followed by base content with proper spacing.

## Implementation Considerations

### Template Registry Changes

**Required**: No changes needed - existing inheritance system supports React template.

**Verification**: Template Registry already implements:
- `getWithBase()` method for loading templates with inheritance
- `mergeTemplates()` method for combining metadata
- Base template resolution and validation

### Template Engine Changes

**Required**: No changes needed - existing merging logic supports React template.

**Verification**: Template Engine already implements:
- `mergePackageJson()` for dependency merging
- `mergePartialFiles()` for .gitignore and README merging
- File rendering with template variable substitution

### File Generation Flow

```
User: extn create my-extension --template react
  ↓
CLI: Parse command and options
  ↓
Registry: Load react template
  ↓
Registry: Detect extends: "base"
  ↓
Registry: Load base template
  ↓
Registry: Merge metadata (deps, scripts)
  ↓
Engine: Render base files (web-ext-config.mjs)
  ↓
Engine: Render React files (components, configs)
  ↓
Engine: Merge package.json (base + React)
  ↓
Engine: Merge .gitignore (React + base partial)
  ↓
Engine: Merge README (React + base partial)
  ↓
Engine: Substitute template variables ({{projectName}}, etc.)
  ↓
Output: Complete React project with Browser Preview
```


## Development Workflow

### Local Development

```bash
# Create new React extension
extn create my-react-extension --template react

# Navigate to project
cd my-react-extension

# Install dependencies
npm install

# Start development with Browser Preview
npm run dev
```

**What happens**:
1. Vite starts dev server on `http://localhost:5173`
2. web-ext launches Chrome with extension loaded
3. Changes to React components trigger HMR
4. Browser auto-reloads on manifest changes

### Production Build

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Output in dist/ directory
```

**Build output**:
```
dist/
├── manifest.json
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   └── index.js (bundled)
│   ├── content/
│   │   └── index.js (bundled)
│   └── background/
│       └── background.js (bundled)
└── public/
    └── icons/
```

### Testing Workflow

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Performance Considerations

### Bundle Size Optimization

**Strategy**: Leverage Vite's tree-shaking and code splitting.

```typescript
// vite.config.ts - Add build optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### React Performance

**Strategy**: Use React best practices for extension performance.

```tsx
// Memoize expensive computations
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);

// Memoize callbacks to prevent re-renders
const handleClick = useCallback(() => {
  // Handle click
}, []);

// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Content Script Performance

**Strategy**: Minimize content script bundle size and DOM manipulation.

```tsx
// Only inject UI when needed
if (shouldShowUI) {
  const container = document.createElement('div');
  container.id = 'extn-react-content';
  document.body.appendChild(container);
  
  ReactDOM.createRoot(container).render(<Content />);
}
```


## Security Considerations

### Content Security Policy

**Issue**: React uses inline scripts which may violate CSP.

**Solution**: Vite's production build generates external scripts, compliant with Manifest V3 CSP.

```json
// manifest.json - No CSP needed, Vite handles it
{
  "manifest_version": 3,
  // CSP is automatically compliant with external scripts
}
```

### Chrome API Access

**Strategy**: Validate and sanitize all Chrome API inputs/outputs.

```typescript
// Safe message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Validate message structure
  if (!message || typeof message !== 'object') {
    sendResponse({ error: 'Invalid message' });
    return;
  }
  
  // Validate sender
  if (!sender.tab || !sender.tab.id) {
    sendResponse({ error: 'Invalid sender' });
    return;
  }
  
  // Process message safely
  handleMessage(message, sender).then(sendResponse);
  return true;
});
```

### XSS Prevention

**Strategy**: Use React's built-in XSS protection and avoid dangerouslySetInnerHTML.

```tsx
// Safe - React escapes by default
<div>{userInput}</div>

// Unsafe - Avoid unless absolutely necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If HTML is needed, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Migration Path

### From Vanilla to React

**Steps for users**:

1. Create new React project: `extn create my-extension --template react`
2. Copy manifest permissions and configuration
3. Convert vanilla JS components to React components
4. Update imports and module structure
5. Test thoroughly with `npm run dev`

**Example conversion**:

```javascript
// Vanilla (popup.js)
document.getElementById('button').addEventListener('click', () => {
  chrome.storage.local.get(['count'], (result) => {
    const count = (result.count || 0) + 1;
    chrome.storage.local.set({ count });
    document.getElementById('count').textContent = count;
  });
});
```

```tsx
// React (Popup.tsx)
function Popup() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    chrome.storage.local.get(['count'], (result) => {
      setCount(result.count || 0);
    });
  }, []);
  
  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

## Future Enhancements

### Potential Additions

1. **CSS-in-JS Support**: Add styled-components or emotion
2. **State Management**: Add Zustand or Redux Toolkit template variant
3. **UI Component Library**: Add Material-UI or Chakra UI variant
4. **React Router**: Add routing for multi-page extensions
5. **React Query**: Add data fetching and caching
6. **Tailwind CSS**: Add utility-first CSS framework variant

### Template Variants

```
react (base)
├── react-mui (+ Material-UI)
├── react-tailwind (+ Tailwind CSS)
├── react-redux (+ Redux Toolkit)
└── react-full (+ all features)
```

## Documentation Requirements

### README.md Content

Must include:
- Project overview and features
- Installation instructions
- Development workflow (`npm run dev`)
- Build instructions (`npm run build`)
- Project structure explanation
- Chrome API usage examples
- Troubleshooting common issues

### Code Comments

Must include:
- Component purpose and props
- Chrome API usage explanations
- Configuration file explanations
- Complex logic explanations

### Example Documentation

```tsx
/**
 * Popup component for the Chrome extension.
 * 
 * Features:
 * - Displays current count from chrome.storage
 * - Increments count on button click
 * - Shows current active tab information
 * 
 * Chrome APIs used:
 * - chrome.storage.local: Persistent storage
 * - chrome.tabs.query: Get current tab info
 */
export function Popup() {
  // Component implementation
}
```

## Validation and Testing

### Template Validation

**Pre-release checklist**:
- [ ] Template extends base correctly
- [ ] All dependencies are correct versions
- [ ] TypeScript compiles without errors
- [ ] Vite builds successfully
- [ ] Extension loads in Chrome
- [ ] HMR works correctly
- [ ] All example components render
- [ ] Chrome APIs work as expected
- [ ] Documentation is complete and accurate

### Integration Testing

**Test scenarios**:
1. Create project with React template
2. Install dependencies
3. Run `npm run dev` - verify browser launches
4. Modify component - verify HMR updates
5. Run `npm run build` - verify dist output
6. Load dist in Chrome - verify functionality
7. Run `npm run type-check` - verify no errors

## Summary

The React template design leverages the existing template inheritance system to provide a modern React development experience while maintaining consistency with other framework templates. Key design decisions include:

1. **Inheritance-first approach**: Extends base template for Browser Preview features
2. **TypeScript-native**: Full type safety for React and Chrome APIs
3. **Modern React patterns**: Hooks, functional components, React 18 features
4. **Minimal configuration**: Sensible defaults with clear customization paths
5. **Shared components**: Maximizes code reuse with Vue and Svelte templates
6. **Production-ready**: Includes error handling, testing, and performance optimizations

The design requires no changes to existing Template Registry or Template Engine code, demonstrating the flexibility and extensibility of the current architecture.
