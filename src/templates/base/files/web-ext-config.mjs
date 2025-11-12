/**
 * web-ext configuration for Chrome extension development
 * 
 * This configuration is used by the web-ext CLI tool to run and test
 * the extension during development. It configures browser startup
 * and development tools.
 * 
 * @see https://extensionworkshop.com/documentation/develop/web-ext-command-reference/
 */
export default {
  // Global options
  sourceDir: './dist',
  ignoreFiles: [
    'web-ext-config.mjs',
    'vite.config.js',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'node_modules/**',
    'src/**',
    '.git/**',
  ],
  verbose: false,

  // Run command specific options
  run: {
    // Open chrome://extensions page on startup
    startUrl: ['chrome://extensions'],
  },
};
