# Vue Template Design Document

## Overview

The Vue template extends the base template to provide a modern Vue 3 development experience for Chrome extensions. It leverages the template inheritance system to automatically include Browser Preview features while adding Vue-specific configurations, TypeScript support, and example components. The design follows the established pattern used by the React and vanilla templates, ensuring consistency and maintainability.

### Key Design Principles

1. **Inheritance-First**: Leverage base template for all shared features
2. **TypeScript-Native**: Full type safety for Vue and Chrome APIs
3. **Modern Vue 3**: Use Composition API with `<script setup>` syntax
4. **Minimal Configuration**: Sensible defaults with clear override paths
5. **Framework Consistency**: Share patterns with React and future Svelte templates

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
│                    Vue Template                              │
│  - Vue 3.x                                                   │
│  - TypeScript 5 + type definitions                           │
│  - @vitejs/plugin-vue                                        │
│  - @crxjs/vite-plugin                                        │
│  - vite.config.ts (Vue + CRX plugins)                        │
│  - tsconfig.json (Vue SFC config)                            │
│  - Vue component structure (SFC)                             │
│  - Example popup/content/background                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Diagram

```
Vue Template Files
├── template.json                    # Template metadata with base extension
├── files/
│   ├── package.json.template        # Vue deps (merged with base)
│   ├── tsconfig.json                # TypeScript config for Vue
│   ├── vite.config.ts.template      # Vite + Vue + CRX plugins
│   ├── manifest.template.json       # Manifest V3 with Vue entry points
│   ├── .gitignore.template          # Vue-specific ignores (merged with base)
│   ├── README.md.template           # Vue docs (merged with base)
│   ├── public/
│   │   └── icons/                   # Extension icons (16, 48, 128)
│   └── src/
│       ├── popup/
│       │   ├── Popup.vue            # Main popup component (SFC)
│       │   ├── popup.html           # HTML entry point
│       │   └── main.ts              # Vue app entry
│       ├── content/
│       │   ├── Content.vue          # Content script component (SFC)
│       │   └── main.ts              # Content script entry
│       ├── background/
│       │   └── background.ts        # Service worker
│       └── types/
│           └── chrome.d.ts          # Chrome API type augmentations
```

## Components and Interfaces

### Template Configuration (template.json)

```json
{
  "id": "vue",
  "name": "Vue",
  "description": "Chrome extension with Vue 3 and TypeScript",
  "extends": "base",
  "dependencies": [
    "vue@^3.5.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "@types/chrome@^0.0.270",
    "@vitejs/plugin-vue@^5.2.0",
    "typescript@^5.6.0",
    "vite@^7.2.2",
    "vue-tsc@^2.1.0"
  ],
  "scripts": {
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  }
}
```

**Design Decisions:**
- Extends "base" to inherit Browser Preview features
- Vue 3.5+ for latest features and performance
- TypeScript 5.6+ for modern type system features
- vue-tsc for Vue-specific TypeScript checking
- Separate type-check script for CI/CD integration
- Build script runs vue-tsc first to catch type errors early

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    
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
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Design Decisions:**
- `moduleResolution: "bundler"` - Vite-compatible module resolution
- `strict: true` - Maximum type safety
- `noEmit: true` - TypeScript for type checking only, Vite handles compilation
- Include `.vue` files for SFC type checking
- Path aliases for cleaner imports (`@/` maps to `src/`)

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    vue(),
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
- Vue plugin first for SFC compilation
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
      "js": ["src/content/main.ts"]
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
      "resources": ["src/content/main.ts"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

**Design Decisions:**
- TypeScript file extensions (.ts) - @crxjs/vite-plugin handles compilation
- Content script as Vue component for UI injection
- web_accessible_resources for content script assets
- Standard permissions (storage, tabs) as examples
- Popup HTML entry point loads Vue app

## Data Models

### Project Structure Model

```typescript
interface VueTemplateStructure {
  config: {
    typescript: 'tsconfig.json';
    vite: 'vite.config.ts';
    manifest: 'manifest.json';
  };
  source: {
    popup: {
      component: 'src/popup/Popup.vue';
      entry: 'src/popup/main.ts';
      html: 'src/popup/popup.html';
    };
    content: {
      component: 'src/content/Content.vue';
      entry: 'src/content/main.ts';
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

#### Popup Component (src/popup/Popup.vue)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);
const currentTab = ref<chrome.tabs.Tab | null>(null);

onMounted(() => {
  // Load saved count from storage
  chrome.storage.local.get(['count'], (result) => {
    if (result.count) count.value = result.count;
  });

  // Get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTab.value = tabs[0];
  });
});

const handleIncrement = () => {
  count.value++;
  chrome.storage.local.set({ count: count.value });
};
</script>

<template>
  <div class="popup">
    <h1>{{projectName}}</h1>
    <p>Count: {{ count }}</p>
    <button @click="handleIncrement">Increment</button>
    <p v-if="currentTab">Current tab: {{ currentTab.title }}</p>
  </div>
</template>

<style scoped>
.popup {
  width: 300px;
  padding: 20px;
}

button {
  padding: 8px 16px;
  margin: 10px 0;
  cursor: pointer;
}
</style>
```

#### Popup Entry Point (src/popup/main.ts)

```typescript
import { createApp } from 'vue';
import Popup from './Popup.vue';

createApp(Popup).mount('#app');
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
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

#### Content Script Component (src/content/Content.vue)

```vue
<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(true);

const handleClose = () => {
  visible.value = false;
};
</script>

<template>
  <div v-if="visible" class="content-overlay">
    <p>Extension loaded!</p>
    <button @click="handleClose">Close</button>
  </div>
</template>

<style scoped>
.content-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 10000;
}

button {
  margin-top: 8px;
  padding: 4px 8px;
  cursor: pointer;
}
</style>
```

#### Content Script Entry Point (src/content/main.ts)

```typescript
import { createApp } from 'vue';
import Content from './Content.vue';

// Create a container for the Vue app
const container = document.createElement('div');
container.id = 'extn-vue-content';
document.body.appendChild(container);

// Mount the Vue component
createApp(Content).mount(container);
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

#### Chrome API Type Definitions (src/types/chrome.d.ts)

```typescript
// Chrome API type augmentations for better TypeScript support
declare namespace chrome.storage {
  interface StorageArea {
    get(keys: string[]): Promise<{ [key: string]: any }>;
    set(items: { [key: string]: any }): Promise<void>;
  }
}
```

## Error Handling

### TypeScript Type Safety

**Strategy**: Leverage TypeScript's type system to catch errors at compile time.

```typescript
// Usage with type safety in Vue components
const result = await chrome.storage.local.get(['count']);
const count: number = result.count ?? 0;
```

### Vue Error Handling

**Strategy**: Use Vue's global error handler to catch and handle component errors gracefully.

```typescript
// src/popup/main.ts
import { createApp } from 'vue';
import Popup from './Popup.vue';

const app = createApp(Popup);

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', instance);
  console.error('Error Info:', info);
};

app.mount('#app');
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

// Usage in Vue component
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

**Framework**: Vitest with Vue Test Utils

**Scope**: Test Vue components in isolation

```typescript
// Example: src/popup/__tests__/Popup.test.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Popup from '../Popup.vue';

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
    const wrapper = mount(Popup);
    expect(wrapper.text()).toContain('{{projectName}}');
  });

  it('increments count on button click', async () => {
    const wrapper = mount(Popup);
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ count: 1 });
  });
});
```

**Test Configuration**: Add to template's package.json

```json
{
  "devDependencies": {
    "@vue/test-utils": "^2.4.0",
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

### Components Shared with React and Svelte Templates

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

The following components are unique to the Vue template:

- `@vitejs/plugin-vue` - SFC compilation
- `vue` - Framework runtime
- `vue-tsc` - Vue TypeScript compiler
- `tsconfig.json` with Vue-specific settings (include .vue files)
- `.vue` file extensions
- Vue component patterns (Composition API, SFC, `<script setup>`)

## Template File Merging Design

### Package.json Merging

**Process**: Base and Vue package.json files are merged by the Template Engine.

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

**Vue package.json.template**:
```json
{
  "name": "{{projectName}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "@types/chrome": "^0.0.270",
    "@vitejs/plugin-vue": "^5.2.0",
    "typescript": "^5.6.0",
    "vite": "^7.2.2",
    "vue-tsc": "^2.1.0"
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
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0",
    "@crxjs/vite-plugin": "^2.2.1",
    "@types/chrome": "^0.0.270",
    "@vitejs/plugin-vue": "^5.2.0",
    "typescript": "^5.6.0",
    "vite": "^7.2.2",
    "vue-tsc": "^2.1.0"
  }
}
```

### .gitignore Merging

**Process**: Base partial is appended to Vue template file.

**Vue .gitignore.template**:
```
node_modules/
dist/
.vscode/
*.log
.DS_Store
```

**Merged Result**: Same as Vue template (base has no additional entries).

### README Merging

**Process**: Base partial is appended to Vue template file.

**Vue README.md.template**:
```markdown
# {{projectName}}

A Chrome extension built with Vue 3 and TypeScript.

## Features

- Vue 3 with Composition API
- TypeScript support
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

**Merged Result**: Vue content followed by base content with proper spacing.

## Implementation Considerations

### Template Registry Changes

**Required**: No changes needed - existing inheritance system supports Vue template.

**Verification**: Template Registry already implements:
- `getWithBase()` method for loading templates with inheritance
- `mergeTemplates()` method for combining metadata
- Base template resolution and validation

### Template Engine Changes

**Required**: No changes needed - existing merging logic supports Vue template.

**Verification**: Template Engine already implements:
- `mergePackageJson()` for dependency merging
- `mergePartialFiles()` for .gitignore and README merging
- File rendering with template variable substitution

### File Generation Flow

```
User: extn create my-extension --template vue
  ↓
CLI: Parse command and options
  ↓
Registry: Load vue template
  ↓
Registry: Detect extends: "base"
  ↓
Registry: Load base template
  ↓
Registry: Merge metadata (deps, scripts)
  ↓
Engine: Render base files (web-ext-config.mjs)
  ↓
Engine: Render Vue files (components, configs)
  ↓
Engine: Merge package.json (base + Vue)
  ↓
Engine: Merge .gitignore (Vue + base partial)
  ↓
Engine: Merge README (Vue + base partial)
  ↓
Engine: Substitute template variables ({{projectName}}, etc.)
  ↓
Output: Complete Vue project with Browser Preview
```

## Development Workflow

### Local Development

```bash
# Create new Vue extension
extn create my-vue-extension --template vue

# Navigate to project
cd my-vue-extension

# Install dependencies
npm install

# Start development with Browser Preview
npm run dev
```

**What happens**:
1. Vite starts dev server on `http://localhost:5173`
2. web-ext launches Chrome with extension loaded
3. Changes to Vue components trigger HMR
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
│   │   └── main.js (bundled)
│   ├── content/
│   │   └── main.js (bundled)
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
          'vue-vendor': ['vue'],
        },
      },
    },
  },
});
```

### Vue Performance

**Strategy**: Use Vue best practices for extension performance.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

// Use computed for derived state
const count = ref(0);
const doubleCount = computed(() => count.value * 2);

// Use v-once for static content
</script>

<template>
  <div v-once>Static content that never changes</div>
  <div>{{ doubleCount }}</div>
</template>
```

### Content Script Performance

**Strategy**: Minimize content script bundle size and DOM manipulation.

```typescript
// Only inject UI when needed
if (shouldShowUI) {
  const container = document.createElement('div');
  container.id = 'extn-vue-content';
  document.body.appendChild(container);
  
  createApp(Content).mount(container);
}
```

## Security Considerations

### Content Security Policy

**Issue**: Vue uses inline scripts which may violate CSP.

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

**Strategy**: Use Vue's built-in XSS protection and avoid v-html with user input.

```vue
<template>
  <!-- Safe - Vue escapes by default -->
  <div>{{ userInput }}</div>

  <!-- Unsafe - Avoid unless absolutely necessary -->
  <div v-html="userInput"></div>

  <!-- If HTML is needed, sanitize first -->
  <div v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';

const sanitizedHtml = computed(() => DOMPurify.sanitize(userInput.value));
</script>
```

## Migration Path

### From Vanilla to Vue

**Steps for users**:

1. Create new Vue project: `extn create my-extension --template vue`
2. Copy manifest permissions and configuration
3. Convert vanilla JS components to Vue SFC components
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

```vue
<!-- Vue (Popup.vue) -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);

onMounted(() => {
  chrome.storage.local.get(['count'], (result) => {
    count.value = result.count || 0;
  });
});

const handleClick = () => {
  count.value++;
  chrome.storage.local.set({ count: count.value });
};
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>
```

## Future Enhancements

### Potential Additions

1. **Pinia State Management**: Add Pinia for centralized state management
2. **Vue Router**: Add routing for multi-page extensions
3. **UI Component Library**: Add Vuetify or Element Plus variant
4. **Composables Library**: Add VueUse for common utilities
5. **Tailwind CSS**: Add utility-first CSS framework variant

### Template Variants

```
vue (base)
├── vue-pinia (+ Pinia state management)
├── vue-tailwind (+ Tailwind CSS)
├── vue-router (+ Vue Router)
└── vue-full (+ all features)
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

```vue
<!--
  Popup component for the Chrome extension.
  
  Features:
  - Displays current count from chrome.storage
  - Increments count on button click
  - Shows current active tab information
  
  Chrome APIs used:
  - chrome.storage.local: Persistent storage
  - chrome.tabs.query: Get current tab info
-->
<script setup lang="ts">
// Component implementation
</script>
```

## Validation and Testing

### Template Validation

**Pre-release checklist**:
- [ ] Template extends base correctly
- [ ] All dependencies are correct versions
- [ ] TypeScript compiles without errors
- [ ] vue-tsc type checks successfully
- [ ] Vite builds successfully
- [ ] Extension loads in Chrome
- [ ] HMR works correctly
- [ ] All example components render
- [ ] Chrome APIs work as expected
- [ ] Documentation is complete and accurate

### Integration Testing

**Test scenarios**:
1. Create project with Vue template
2. Install dependencies
3. Run `npm run dev` - verify browser launches
4. Modify component - verify HMR updates
5. Run `npm run build` - verify dist output
6. Load dist in Chrome - verify functionality
7. Run `npm run type-check` - verify no type errors
8. Test all Chrome API integrations
