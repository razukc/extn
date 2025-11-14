# Template Inheritance System

This document explains how the template inheritance system works in extn, allowing templates to share common features while maintaining their specific configurations.

## Overview

The template inheritance system enables templates to extend a base template, inheriting shared functionality while adding their own specific features. This architecture ensures that all templates (vanilla, React, Vue, etc.) automatically include Browser Preview features without code duplication.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Base Template                             │
│  (Shared Browser Preview Features)                           │
│  - web-ext-config.mjs                                        │
│  - dev script pattern                                        │
│  - web-ext + concurrently dependencies                       │
│  - .dev-profile/ in .gitignore                               │
│  - Dev workflow documentation                                │
└────────┬──────────────────────────────────┬────────────────┘
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
│   Vanilla Template     │         │   React Template       │         │   Vue Template         │
│   - vite.config.js     │         │   - vite.config.ts     │         │   - vite.config.ts     │
│   - Vanilla deps       │         │   - React 18 + TS      │         │   - Vue 3 + TS         │
│   - Basic structure    │         │   - React components   │         │   - Vue SFC components │
└────────────────────────┘         │   - Testing setup      │         │   - Testing setup      │
                                    └────────────────────────┘         └────────────────────────┘
```

## Base Template Structure

The base template contains shared features that all templates inherit:

```
src/templates/base/
├── template.json                        # Base metadata
└── files/
    ├── web-ext-config.mjs               # Browser configuration
    ├── .gitignore.partial.template      # Dev profile ignore patterns
    └── README.dev-workflow.partial.md   # Dev workflow documentation
```

### Base template.json

```json
{
  "id": "base",
  "name": "Base Template",
  "description": "Shared Browser Preview features for all templates",
  "dependencies": [],
  "devDependencies": [
    "web-ext@^8.3.0",
    "concurrently@^9.1.0"
  ],
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\""
  }
}
```

## Creating a Template That Extends Base

To create a new template that inherits Browser Preview features:

### 1. Create Template Directory

```
src/templates/your-template/
├── template.json
└── files/
    ├── manifest.json.template
    ├── vite.config.js.template
    ├── package.json.template
    ├── .gitignore.template
    ├── README.md.template
    └── src/
        └── (your template files)
```

### 2. Configure template.json

Add the `extends` field to inherit from base:

```json
{
  "id": "your-template",
  "name": "Your Template Name",
  "description": "Description of your template",
  "extends": "base",
  "dependencies": [
    "your-runtime-deps@^1.0.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "vite@^7.2.2",
    "your-dev-deps@^1.0.0"
  ],
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Key points:**
- `extends: "base"` - Inherit Browser Preview features
- Don't include `web-ext` or `concurrently` - they come from base
- Don't define `dev` script - it's inherited from base
- Add your template-specific dependencies and scripts

### 3. Create Template Files

Your template files will be merged with base template files:

**package.json.template** - Will be merged with base:
```json
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

**.gitignore.template** - Will be merged with base partial:
```
node_modules/
dist/
.vscode/
your-template-specific-ignores/
```

**README.md.template** - Will be merged with base partial:
```markdown
# {{projectName}}

Your template-specific documentation here.

## Getting Started

Template-specific instructions...

## Features

- Your template features
```

## File Merging Rules

### Package.json Merging

When a template extends base, `package.json` files are merged:

**Merge Strategy:**
1. **scripts**: Base scripts + template scripts (template overrides on conflict)
2. **dependencies**: Base deps + template deps (template version overrides)
3. **devDependencies**: Base devDeps + template devDeps (template version overrides)
4. **Other fields**: Template values take precedence

**Example:**

Base package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\""
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0"
  }
}
```

Template package.json:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

Merged result:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\"",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0",
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

### Partial File Merging

Files with `.partial` in their name are merged with template-specific files:

**Naming Convention:**
- Base: `filename.partial.template` (e.g., `.gitignore.partial.template`)
- Template: `filename.template` (e.g., `.gitignore.template`)
- Result: `filename` (e.g., `.gitignore`)

**Merge Strategy:**
1. Template file content comes first
2. Base partial content is appended
3. A blank line separates the two sections

**Example - .gitignore merging:**

Template `.gitignore.template`:
```
node_modules/
dist/
.vscode/
```

Base `.gitignore.partial.template`:
```
# Development profile (Browser Preview)
.dev-profile/
```

Merged `.gitignore`:
```
node_modules/
dist/
.vscode/

# Development profile (Browser Preview)
.dev-profile/
```

**Example - README merging:**

Template `README.md.template`:
```markdown
# {{projectName}}

A Chrome extension built with {{templateName}}.

## Features

- Feature 1
- Feature 2
```

Base `README.dev-workflow.partial.md`:
```markdown
## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will automatically launch Chrome with your extension loaded.
```

Merged `README.md`:
```markdown
# {{projectName}}

A Chrome extension built with {{templateName}}.

## Features

- Feature 1
- Feature 2

## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will automatically launch Chrome with your extension loaded.
```

### File Override Rules

When both base and template have the same file (non-partial):

1. **Non-partial files**: Template file completely overrides base file
2. **Partial files**: Files are merged (see above)
3. **package.json**: Special merging logic (see above)

This ensures template-specific customizations always take precedence while preserving shared functionality.

## Template Resolution Flow

When a user creates a project:

```
User runs: extn create my-extension --template vanilla
  ↓
Registry loads vanilla template
  ↓
Registry detects vanilla extends "base"
  ↓
Registry loads base template
  ↓
Registry merges metadata (deps, scripts)
  ↓
Engine renders files from base template
  ↓
Engine renders files from vanilla template
  ↓
Engine merges package.json (base + vanilla)
  ↓
Engine merges partial files (.gitignore, README)
  ↓
Project created with combined files
```

## Implementation Details

### Template Interface

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  files: string;
  dependencies: string[];
  devDependencies: string[];
  scripts?: Record<string, string>;  // npm scripts
  extends?: string;                   // base template id
}
```

### Registry Methods

```typescript
// Load template with base inheritance
async getWithBase(templateId: string): Promise<Template> {
  const template = await this.get(templateId);
  
  if (template.extends) {
    const baseTemplate = await this.get(template.extends);
    return this.mergeTemplates(baseTemplate, template);
  }
  
  return template;
}

// Merge base and specific template metadata
private mergeTemplates(base: Template, specific: Template): Template {
  return {
    ...specific,
    scripts: { ...base.scripts, ...specific.scripts },
    dependencies: [...base.dependencies, ...specific.dependencies],
    devDependencies: [...base.devDependencies, ...specific.devDependencies],
  };
}
```

### Engine Methods

```typescript
// Merge package.json from base and template
mergePackageJson(basePackage: any, templatePackage: any): any {
  return {
    ...basePackage,
    ...templatePackage,
    scripts: {
      ...basePackage.scripts,
      ...templatePackage.scripts,
    },
    dependencies: this.mergeDependencies(
      basePackage.dependencies,
      templatePackage.dependencies
    ),
    devDependencies: this.mergeDependencies(
      basePackage.devDependencies,
      templatePackage.devDependencies
    ),
  };
}

// Merge partial files (append base partial to template file)
mergePartialFiles(templateContent: string, partialContent: string): string {
  return `${templateContent}\n\n${partialContent}`;
}
```

## Benefits

### For Template Creators

- **No Duplication**: Browser Preview features defined once in base
- **Focus on Framework**: Only implement framework-specific features
- **Automatic Updates**: Base improvements apply to all templates
- **Clear Separation**: Framework code separate from dev workflow

### For Users

- **Consistent Experience**: Same dev workflow across all templates
- **Automatic Features**: New templates get Browser Preview automatically
- **Predictable Behavior**: `npm run dev` works the same everywhere
- **Easy Customization**: Override base features when needed

### For Maintainers

- **Single Source of Truth**: Browser Preview maintained in one place
- **Easy Testing**: Test base features once, applies to all templates
- **Simple Updates**: Update base to improve all templates
- **Extensible**: Easy to add new shared features

## Examples

### Example 1: Vanilla Template (Current)

```json
{
  "id": "vanilla",
  "name": "Vanilla JavaScript",
  "description": "Basic Chrome extension with vanilla JavaScript",
  "extends": "base",
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "vite@^7.2.2"
  ],
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Inherits from base:**
- `web-ext` and `concurrently` dependencies
- `dev` script with browser auto-launch
- `web-ext-config.mjs` file
- Dev workflow documentation

**Adds:**
- Vite and @crxjs/vite-plugin
- Build and preview scripts
- Vanilla-specific file structure

### Example 2: React Template

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

**Inherits from base:**
- Browser Preview features (same as vanilla)
- `dev` script with auto-launch
- `web-ext` and `concurrently` dependencies
- Dev workflow documentation

**Adds:**
- React 18 and React DOM
- TypeScript with strict mode
- React-specific Vite plugin
- Chrome API type definitions
- Type checking script
- React component structure (popup, content script)

**Project Structure:**
```
my-react-extension/
├── src/
│   ├── popup/
│   │   ├── Popup.tsx           # React popup component
│   │   ├── popup.html          # HTML entry point
│   │   └── index.tsx           # React render entry
│   ├── content/
│   │   ├── Content.tsx         # React content script
│   │   └── index.tsx           # Content script entry
│   ├── background/
│   │   └── background.ts       # Service worker
│   ├── components/
│   │   └── ErrorBoundary.tsx   # Error boundary component
│   └── types/
│       └── chrome.d.ts         # Chrome API type augmentations
├── public/
│   └── icons/                  # Extension icons
├── manifest.json               # Manifest V3 with React entry points
├── vite.config.ts              # Vite + React + CRX plugins
├── tsconfig.json               # TypeScript config for React
├── vitest.config.ts            # Testing configuration
└── web-ext-config.mjs          # Inherited from base
```

### React Template Details

The React template demonstrates the full power of template inheritance:

**File Merging in Action:**

1. **package.json merging:**
   - Base provides: `dev` script, `web-ext`, `concurrently`
   - React adds: `build`, `preview`, `type-check` scripts, React deps, TypeScript
   - Result: Complete package.json with all scripts and dependencies

2. **.gitignore merging:**
   - React template: `node_modules/`, `dist/`, `.vscode/`, `*.log`, `*.tsbuildinfo`
   - Base partial: `.dev-profile/` (Browser Preview profile)
   - Result: Complete .gitignore with both sets of patterns

3. **README merging:**
   - React template: Project overview, React features, TypeScript usage
   - Base partial: Development workflow with `npm run dev` instructions
   - Result: Complete README with React docs + Browser Preview workflow

**React-Specific Features:**

- **Modern JSX Transform**: `jsx: "react-jsx"` in tsconfig.json - no React imports needed
- **Strict TypeScript**: Full type safety for React components and Chrome APIs
- **Component Structure**: Popup and content scripts as React components
- **Error Boundaries**: Built-in error handling for production reliability
- **Testing Ready**: Vitest + React Testing Library pre-configured
- **HMR Support**: Hot module replacement for instant feedback during development

**Chrome Extension Integration:**

The React template shows how to integrate React with Chrome extension APIs:

```tsx
// Example: Popup component with Chrome storage
import { useState, useEffect } from 'react';

export function Popup() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['count'], (result) => {
      if (result.count) setCount(result.count);
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

**Development Experience:**

```bash
# Create React extension
extn create my-react-extension --template react

# Install dependencies
cd my-react-extension
npm install

# Start development (inherited from base)
npm run dev
# ✨ Vite builds with React HMR
# 🚀 Chrome launches with extension loaded
# 🔄 Changes update instantly

# Type check (React-specific)
npm run type-check

# Build for production (React-specific)
npm run build
```

### Example 3: Vue Template

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

**Inherits from base:**
- Browser Preview features (same as vanilla and React)
- `dev` script with auto-launch
- `web-ext` and `concurrently` dependencies
- Dev workflow documentation

**Adds:**
- Vue 3 with Composition API
- TypeScript with strict mode
- Vue-specific Vite plugin
- Chrome API type definitions
- Type checking script
- Vue SFC component structure (popup, content script)

**Project Structure:**
```
my-vue-extension/
├── src/
│   ├── popup/
│   │   ├── Popup.vue           # Vue popup component
│   │   ├── popup.html          # HTML entry point
│   │   └── main.ts             # Vue app entry
│   ├── content/
│   │   ├── Content.vue         # Vue content script
│   │   └── main.ts             # Content script entry
│   ├── background/
│   │   └── background.ts       # Service worker
│   └── types/
│       └── chrome.d.ts         # Chrome API type augmentations
├── public/
│   └── icons/                  # Extension icons
├── manifest.json               # Manifest V3 with Vue entry points
├── vite.config.ts              # Vite + Vue + CRX plugins
├── tsconfig.json               # TypeScript config for Vue
├── vitest.config.ts            # Testing configuration
└── web-ext-config.mjs          # Inherited from base
```

### Vue Template Details

The Vue template demonstrates template inheritance with Vue 3 and the Composition API:

**File Merging in Action:**

1. **package.json merging:**
   - Base provides: `dev` script, `web-ext`, `concurrently`
   - Vue adds: `build`, `preview`, `type-check` scripts, Vue deps, TypeScript
   - Result: Complete package.json with all scripts and dependencies

2. **.gitignore merging:**
   - Vue template: `node_modules/`, `dist/`, `.vscode/`, `*.log`, `*.tsbuildinfo`
   - Base partial: `.dev-profile/` (Browser Preview profile)
   - Result: Complete .gitignore with both sets of patterns

3. **README merging:**
   - Vue template: Project overview, Vue features, TypeScript usage
   - Base partial: Development workflow with `npm run dev` instructions
   - Result: Complete README with Vue docs + Browser Preview workflow

**Vue-Specific Features:**

- **Composition API**: Modern `<script setup>` syntax for cleaner component code
- **Strict TypeScript**: Full type safety for Vue components and Chrome APIs
- **Single File Components**: Template, script, and style in one `.vue` file
- **Scoped Styles**: Component-scoped CSS with `<style scoped>`
- **Testing Ready**: Vitest + Vue Test Utils pre-configured
- **HMR Support**: Hot module replacement for instant feedback during development

**Chrome Extension Integration:**

The Vue template shows how to integrate Vue with Chrome extension APIs:

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
    <h1>My Extension</h1>
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

**Development Experience:**

```bash
# Create Vue extension
extn create my-vue-extension --template vue

# Install dependencies
cd my-vue-extension
npm install

# Start development (inherited from base)
npm run dev
# ✨ Vite builds with Vue HMR
# 🚀 Chrome launches with extension loaded
# 🔄 Changes update instantly

# Type check (Vue-specific)
npm run type-check

# Build for production (Vue-specific)
npm run build
```

## Using the Vue Template

### Getting Started

Create a new Vue-based Chrome extension:

```bash
extn create my-vue-extension --template vue
cd my-vue-extension
npm install
npm run dev
```

### Vue Template Structure

The Vue template provides a complete Vue 3 development environment:

**Configuration Files:**
- `tsconfig.json` - TypeScript config with Vue SFC support
- `vite.config.ts` - Vite with Vue and CRX plugins
- `vitest.config.ts` - Testing configuration
- `manifest.json` - Manifest V3 with TypeScript entry points
- `web-ext-config.mjs` - Inherited from base template

**Source Structure:**
- `src/popup/` - Vue popup component with Chrome storage example
- `src/content/` - Vue content script component
- `src/background/` - Background service worker (TypeScript)
- `src/types/` - Chrome API type augmentations

### Adding New Components

**Add a new popup page:**

1. Create component: `src/options/Options.vue`
2. Create entry: `src/options/main.ts`
3. Create HTML: `src/options/options.html`
4. Update manifest: Add to `chrome_url_overrides` or `options_page`

**Add a new content script:**

1. Create component: `src/content/MyContent.vue`
2. Create entry: `src/content/my-content.ts`
3. Update manifest: Add to `content_scripts` array

### Vue + Chrome APIs

**Using Chrome Storage:**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const data = ref(null);

onMounted(() => {
  chrome.storage.local.get(['key'], (result) => {
    data.value = result.key;
  });
});

const saveData = (value: any) => {
  chrome.storage.local.set({ key: value });
  data.value = value;
};
</script>

<template>
  <div>
    <p>Data: {{ data }}</p>
    <button @click="saveData('new value')">Save</button>
  </div>
</template>
```

**Using Chrome Messaging:**

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const handleMessage = (message: any, sender: any, sendResponse: any) => {
  console.log('Message received:', message);
  sendResponse({ status: 'ok' });
};

onMounted(() => {
  chrome.runtime.onMessage.addListener(handleMessage);
});

onUnmounted(() => {
  chrome.runtime.onMessage.removeListener(handleMessage);
});

const sendMessage = () => {
  chrome.runtime.sendMessage({ type: 'HELLO' });
};
</script>

<template>
  <button @click="sendMessage">Send Message</button>
</template>
```

### Testing Vue Components

The Vue template includes Vitest and Vue Test Utils:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Example test:**

```typescript
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
  it('renders correctly', () => {
    const wrapper = mount(Popup);
    expect(wrapper.text()).toContain('my-vue-extension');
  });

  it('increments count', async () => {
    const wrapper = mount(Popup);
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });
});
```

### TypeScript Tips

**Chrome API Types:**

The template includes type augmentations in `src/types/chrome.d.ts`:

```typescript
// Extend Chrome API types
declare namespace chrome.storage {
  interface StorageArea {
    get(keys: string[]): Promise<{ [key: string]: any }>;
    set(items: { [key: string]: any }): Promise<void>;
  }
}
```

**Component Props:**

```vue
<script setup lang="ts">
interface Props {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0,
});

const emit = defineEmits<{
  countChange: [count: number];
}>();
</script>
```

### Performance Optimization

**Async Components:**

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

**Computed Properties:**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const data = ref<any[]>([]);

const processedData = computed(() => {
  return data.value.map(item => /* expensive operation */);
});
</script>

<template>
  <div v-for="item in processedData" :key="item.id">
    {{ item }}
  </div>
</template>
```

## Using the React Template

### Getting Started

Create a new React-based Chrome extension:

```bash
extn create my-react-extension --template react
cd my-react-extension
npm install
npm run dev
```

### React Template Structure

The React template provides a complete React development environment:

**Configuration Files:**
- `tsconfig.json` - TypeScript config with React JSX transform
- `vite.config.ts` - Vite with React and CRX plugins
- `vitest.config.ts` - Testing configuration
- `manifest.json` - Manifest V3 with TypeScript entry points
- `web-ext-config.mjs` - Inherited from base template

**Source Structure:**
- `src/popup/` - React popup component with Chrome storage example
- `src/content/` - React content script component
- `src/background/` - Background service worker (TypeScript)
- `src/components/` - Shared React components (ErrorBoundary)
- `src/types/` - Chrome API type augmentations

### Adding New Components

**Add a new popup page:**

1. Create component: `src/options/Options.tsx`
2. Create entry: `src/options/index.tsx`
3. Create HTML: `src/options/options.html`
4. Update manifest: Add to `chrome_url_overrides` or `options_page`

**Add a new content script:**

1. Create component: `src/content/MyContent.tsx`
2. Create entry: `src/content/my-content.tsx`
3. Update manifest: Add to `content_scripts` array

### React + Chrome APIs

**Using Chrome Storage:**

```tsx
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(['key'], (result) => {
      setData(result.key);
    });
  }, []);

  const saveData = (value: any) => {
    chrome.storage.local.set({ key: value });
    setData(value);
  };

  return <div>{/* Your UI */}</div>;
}
```

**Using Chrome Messaging:**

```tsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    const listener = (message: any, sender: any, sendResponse: any) => {
      console.log('Message received:', message);
      sendResponse({ status: 'ok' });
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const sendMessage = () => {
    chrome.runtime.sendMessage({ type: 'HELLO' });
  };

  return <button onClick={sendMessage}>Send Message</button>;
}
```

### Testing React Components

The React template includes Vitest and React Testing Library:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Example test:**

```tsx
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
} as any;

describe('Popup', () => {
  it('renders correctly', () => {
    render(<Popup />);
    expect(screen.getByText(/my-react-extension/i)).toBeInTheDocument();
  });

  it('increments count', () => {
    render(<Popup />);
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });
});
```

### TypeScript Tips

**Chrome API Types:**

The template includes type augmentations in `src/types/chrome.d.ts`:

```typescript
// Extend Chrome API types
declare namespace chrome.storage {
  interface StorageArea {
    get(keys: string[]): Promise<{ [key: string]: any }>;
    set(items: { [key: string]: any }): Promise<void>;
  }
}
```

**Component Props:**

```tsx
interface PopupProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

export function Popup({ initialCount = 0, onCountChange }: PopupProps) {
  // Component implementation
}
```

### Performance Optimization

**Code Splitting:**

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Memoization:**

```tsx
import { useMemo, useCallback } from 'react';

function MyComponent({ data }: { data: any[] }) {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);

  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div>{/* UI */}</div>;
}
```

## Best Practices

### When Creating Templates

1. **Always extend base** unless you have a specific reason not to
2. **Don't duplicate base features** - let inheritance handle it
3. **Focus on framework-specific code** - build config, dependencies, structure
4. **Document template-specific features** in your README
5. **Test with base features** to ensure compatibility

### When Modifying Base

1. **Keep it framework-agnostic** - base should work with any framework
2. **Test with all templates** - changes affect everything
3. **Document breaking changes** - templates may need updates
4. **Version carefully** - base changes impact all users

### When Customizing Projects

Users can customize generated projects by:

1. **Editing web-ext-config.mjs** - Change browser, profile, launch options
2. **Modifying package.json scripts** - Add custom dev scripts
3. **Updating vite.config.js** - Framework-specific build config
4. **Deleting .dev-profile/** - Reset browser profile

## Troubleshooting

### Template doesn't inherit base features

**Problem:** Generated project missing Browser Preview features

**Solution:**
- Check `template.json` has `"extends": "base"`
- Verify base template exists in `src/templates/base/`
- Check template registry loads base correctly

### Package.json merge conflicts

**Problem:** Dependencies or scripts not merging correctly

**Solution:**
- Check template doesn't override base dependencies
- Verify merge logic in `TemplateEngine.mergePackageJson()`
- Test with minimal template to isolate issue

### Partial files not merging

**Problem:** `.gitignore` or `README` missing base content

**Solution:**
- Check base partial files exist (`.partial.template` suffix)
- Verify template has corresponding non-partial file
- Check merge logic in `TemplateEngine.mergePartialFiles()`

## Future Enhancements

### Multi-Level Inheritance

Support inheritance chains:
```
base → framework-base → specific-template
```

Example:
```
base (Browser Preview)
  ↓
react-base (React + TypeScript)
  ↓
react-tailwind (+ Tailwind CSS)
```

### Conditional Inheritance

Allow templates to conditionally include base features:
```json
{
  "extends": "base",
  "includeFeatures": ["browser-preview", "typescript"]
}
```

### Template Composition

Mix multiple base templates:
```json
{
  "extends": ["base", "typescript-base", "testing-base"]
}
```

## Resources

- [Template Engine Source](../../src/core/template/engine.ts)
- [Template Registry Source](../../src/core/template/registry.ts)
- [Base Template](../../src/templates/base/)
- [Vanilla Template Example](../../src/templates/vanilla/)
