# test-workflow-project

A Chrome Manifest V3 extension built with vanilla JavaScript/TypeScript and Vite.

## Features

- ⚡ Vite-powered build system with HMR
- 📦 Manifest V3 Chrome extension
- ✅ TypeScript support (optional to use)
- 🎨 Example popup, background service worker, and content script
- 🔧 Modern development workflow

## Project Structure

```
test-workflow-project/
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
├── web-ext-config.js       # Browser development configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

This will:
1. Start Vite dev server with HMR
2. Build your extension to `dist/`
3. Launch Chrome with your extension loaded
4. Open DevTools automatically
5. Use a persistent profile in `.dev-profile/`

Your changes will automatically reload in the browser!

### Configuration

You can customize the development experience by editing `web-ext-config.js`:

- Change browser target (chromium, firefox, edge)
- Customize profile location
- Modify browser launch options
- Configure start URLs

## Troubleshooting

### Browser doesn't open
- Ensure Chrome/Chromium is installed
- Check that port 5173 is not in use
- Try running `npm run build` first

### Extension doesn't load
- Check the console for build errors
- Verify manifest.json is valid
- Clear the `.dev-profile/` directory and try again

### Port already in use
- Vite will automatically try the next available port
- You can configure a specific port in `vite.config.js`

### Profile issues
- Delete the `.dev-profile/` directory to reset your development profile
- The profile is separate from your main browser profile


### Build for Production

Build the extension for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder with:
- Minified JavaScript bundles
- Optimized assets
- Validated manifest
- Ready for Chrome Web Store submission

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `dist` folder from your project

## Available Scripts

- `npm run dev` - Start development server with browser auto-launch
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Customization

### Manifest

Edit `manifest.json` to customize your extension:
- Change name, description, and version
- Add or remove permissions
- Configure content script match patterns
- Update icons and popup settings

### Vite Configuration

Edit `vite.config.js` to customize the build:
- Change output directory
- Add plugins
- Configure dev server options
- Modify build optimization settings

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

MIT

