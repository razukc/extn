# Tech Stack

## Core Technologies

- **TypeScript 5.x** - Primary language with strict mode enabled
- **Node.js ES2020** - Runtime environment with ES modules
- **Vitest** - Testing framework with coverage reporting
- **Commander.js** - CLI framework for command parsing
- **Zod** - Schema validation for manifest and config

## Build System

- **TypeScript Compiler (tsc)** - Compiles to ES2020 modules in `dist/`
- **Target**: ES2020, ES modules
- **Output**: `dist/` directory with declaration files and source maps

## Development Dependencies

- **ESLint** - Linting with TypeScript plugin
- **Prettier** - Code formatting (2 spaces, single quotes, 100 char width)
- **memfs** - In-memory file system for testing
- **@vitest/coverage-v8** - Code coverage reporting

## Common Commands

```bash
# Development
npm run build          # Compile TypeScript to dist/
npm run dev            # Watch mode compilation
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Testing
npm test               # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run test:unit      # Run unit tests only
npm run test:integration # Run integration tests only

# Publishing
npm run prepublishOnly # Build and test before publish
```

## Code Quality Standards

- **Test Coverage**: 80%+ overall (90%+ for core logic)
- **TypeScript**: Strict mode, no explicit any (warn only)
- **ESLint**: Recommended rules + TypeScript recommended
- **Prettier**: Enforced formatting on commit

## Testing Strategy

- **Unit tests** (60%) - Core logic, utilities, validation
- **Integration tests** (30%) - Command execution, template generation
- **E2E tests** (10%) - Full CLI workflows
- **Test timeout**: 30 seconds
- **Environment**: Node.js with globals enabled

### Test Output Management

When running test suites, always save output to a temp file for review:

```bash
# Save test output to temp file (output can be very long)
npm test 2>&1 | tee test-temp/test-output.txt

# Then read the output from the file
cat test-temp/test-output.txt
# or for last N lines
tail -n 50 test-temp/test-output.txt
```

This practice:
- Prevents overwhelming console output
- Allows for easier review and analysis
- Preserves full test results for debugging
- Works well with long-running test suites

## Shell Commands

- **ALWAYS use Unix/Bash commands** - Even on Windows (Git Bash/MINGW64 environment)
- **NEVER use Windows-specific commands** (cmd.exe or PowerShell syntax)
- Common operations:
  - Remove directory: `rm -rf directory`
  - Copy files: `cp -r source dest`
  - List files: `ls -la`
  - Find files: `find . -name "pattern"`
  - Check command: `which command`
