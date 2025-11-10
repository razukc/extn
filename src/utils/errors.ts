/**
 * Base error class for all extn errors
 * Provides structured error handling with error codes and context
 */
export class BToolsError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = 'BToolsError';
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when validation fails
 * Used for manifest validation, project structure validation, etc.
 */
export class ValidationError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when file system operations fail
 * Used for file read/write errors, permission issues, etc.
 */
export class FileSystemError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'FS_ERROR', context);
  }
}

/**
 * Error thrown when build operations fail
 * Used for Rollup bundling errors, compilation errors, etc.
 */
export class BuildError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'BUILD_ERROR', context);
  }
}

/**
 * Format an error for user-friendly display
 * Includes the error message and relevant context information
 */
export function formatError(error: BToolsError): string {
  let formatted = `Error: ${error.message}`;

  if (error.context && Object.keys(error.context).length > 0) {
    formatted += '\n\nContext:';
    for (const [key, value] of Object.entries(error.context)) {
      formatted += `\n  ${key}: ${JSON.stringify(value)}`;
    }
  }

  return formatted;
}

/**
 * Check if an error is a BToolsError
 */
export function isBToolsError(error: unknown): error is BToolsError {
  return error instanceof BToolsError;
}

/**
 * Get exit code for an error
 * Maps error types to appropriate exit codes
 */
export function getExitCode(error: unknown): number {
  if (!isBToolsError(error)) {
    return 1; // Generic error
  }

  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 3;
    case 'FS_ERROR':
      return 2;
    case 'BUILD_ERROR':
      return 4;
    default:
      return 1;
  }
}
