# External Documentation Integration

## Context7 MCP Server

Use the Context7 MCP server to get up-to-date documentation and information for third-party packages and frameworks.

### Packages to Use Context7 For

- **WXT** - Web Extension Toolkit framework
- **web-ext** - Mozilla's web extension CLI tool
- **extension-workshop** - Firefox extension workshop tool at context7 (https://context7.com/mozilla/extension-workshop)
- **@crxjs/vite-plugin** - Vite plugin for Chrome extensions
- **Vite** - Build tool and dev server
- **Any other third-party packages** when you need current documentation

### Usage Pattern

1. Use `resolve-library-id` to find the correct library ID
2. Use `get-library-docs` with the library ID to fetch documentation
3. Reference the documentation when implementing features or answering questions

### When to Use

- Before implementing features that depend on third-party APIs
- When troubleshooting integration issues
- When the user asks about specific package capabilities
- When you need to verify current best practices or API changes

## GitHub MCP Server

Use the GitHub MCP server to access repository information, code, issues, and documentation directly from GitHub.

**Note**: GitHub MCP server requires authentication. If you encounter authentication errors, inform the user that they need to configure their GitHub token in the MCP settings.

### What to Use GitHub For

- **Repository exploration** - Browse file structure, read source code, check examples
- **Issue tracking** - Search for known issues, bugs, or feature requests
- **Release information** - Check latest versions, changelogs, and release notes
- **Code examples** - Find real-world usage patterns in the repository
- **Documentation** - Access README files, docs folders, and wiki content
- **API references** - Check type definitions, interfaces, and API documentation

### Common GitHub Operations

- `mcp_github_get_file_contents` - Read files from repositories
- `mcp_github_search_code` - Search for code patterns across repositories
- `mcp_github_search_issues` - Find relevant issues and discussions
- `mcp_github_list_commits` - Check recent changes and updates
- `mcp_github_search_repositories` - Find related projects and tools

### When to Use GitHub

- When you need to see actual implementation details
- When Context7 documentation is insufficient or unclear
- When you need to verify current API signatures or types
- When looking for examples of specific features
- When checking for known issues or limitations
- When you need the most recent changes or updates

### Repositories to Reference

- **wxt-dev/wxt** - WXT framework for web extensions
- **mozilla/web-ext** - Mozilla's web extension CLI tool
- **crxjs/chrome-extension-tools** - Vite plugin for Chrome extensions
- **vitejs/vite** - Vite build tool

## Best Practice

1. Start with Context7 for general documentation and API references
2. Use GitHub when you need specific implementation details or examples
3. Cross-reference both sources for comprehensive understanding
4. Always verify information is current by checking repository activity
