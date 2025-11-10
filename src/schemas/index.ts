/**
 * Chrome Extension Manifest Schema utilities
 * Provides access to the official Chrome manifest JSON schema
 */

import chromeManifestSchema from './chrome-manifest.schema.json' with { type: 'json' };

export { chromeManifestSchema };

/**
 * Schema metadata
 */
export const SCHEMA_INFO = {
  source: 'https://www.schemastore.org/chrome-manifest.json',
  id: chromeManifestSchema.$id,
  schemaVersion: chromeManifestSchema.$schema,
  supportedManifestVersions: [2, 3] as const,
} as const;

/**
 * Get the schema for a specific manifest version
 * This can be used with JSON schema validators like AJV
 */
export function getSchemaForVersion(_version: 2 | 3) {
  return {
    ...chromeManifestSchema,
    // The schema uses conditional logic to handle both versions
    // The validator will automatically apply the correct rules based on manifest_version
  };
}

/**
 * Extract field descriptions from the schema
 * Useful for generating helpful error messages
 */
export function getFieldDescription(fieldPath: string): string | undefined {
  const parts = fieldPath.split('.');
  let current: any = chromeManifestSchema.properties;

  for (const part of parts) {
    if (!current || !current[part]) {
      return undefined;
    }
    current = current[part];
  }

  return current?.description;
}

/**
 * Check if a field is required in the manifest
 */
export function isFieldRequired(fieldName: string): boolean {
  return chromeManifestSchema.required?.includes(fieldName) ?? false;
}

/**
 * Get all required fields
 */
export function getRequiredFields(): string[] {
  return chromeManifestSchema.required || [];
}
