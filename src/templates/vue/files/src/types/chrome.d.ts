// Chrome API type augmentations for better TypeScript support
// These augmentations provide Promise-based APIs and improved type safety
/// <reference types="chrome" />

declare namespace chrome.storage {
  interface StorageArea {
    /**
     * Gets one or more items from storage (Promise-based)
     * @param keys A single key or array of keys to get
     * @returns Promise resolving to an object with items
     */
    get(keys: string | string[] | null): Promise<{ [key: string]: any }>;

    /**
     * Sets multiple items in storage (Promise-based)
     * @param items Object with key-value pairs to set
     * @returns Promise that resolves when items are set
     */
    set(items: { [key: string]: any }): Promise<void>;

    /**
     * Removes one or more items from storage (Promise-based)
     * @param keys A single key or array of keys to remove
     * @returns Promise that resolves when items are removed
     */
    remove(keys: string | string[]): Promise<void>;

    /**
     * Removes all items from storage (Promise-based)
     * @returns Promise that resolves when storage is cleared
     */
    clear(): Promise<void>;
  }
}

declare namespace chrome.tabs {
  /**
   * Query for tabs matching the specified properties (Promise-based)
   * @param queryInfo Properties to match
   * @returns Promise resolving to array of matching tabs
   */
  function query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]>;

  /**
   * Get a specific tab by ID (Promise-based)
   * @param tabId The ID of the tab to get
   * @returns Promise resolving to the tab
   */
  function get(tabId: number): Promise<chrome.tabs.Tab>;

  /**
   * Update properties of a tab (Promise-based)
   * @param tabId The ID of the tab to update
   * @param updateProperties Properties to update
   * @returns Promise resolving to the updated tab
   */
  function update(
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties
  ): Promise<chrome.tabs.Tab>;

  /**
   * Create a new tab (Promise-based)
   * @param createProperties Properties for the new tab
   * @returns Promise resolving to the created tab
   */
  function create(createProperties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab>;
}

declare namespace chrome.runtime {
  /**
   * Send a message to extension pages (Promise-based)
   * @param message The message to send
   * @returns Promise resolving to the response
   */
  function sendMessage<T = any>(message: any): Promise<T>;

  /**
   * Send a message to a specific extension (Promise-based)
   * @param extensionId The ID of the extension to send to
   * @param message The message to send
   * @returns Promise resolving to the response
   */
  function sendMessage<T = any>(extensionId: string, message: any): Promise<T>;

  /**
   * Message listener callback type with proper typing
   */
  type MessageListener = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => boolean | void;
}

// Common message types for type-safe messaging
export interface ExtensionMessage<T = unknown> {
  type: string;
  payload?: T;
}

// Helper type for storage results
export type StorageResult<T> = { [K in keyof T]: T[K] };

// Helper type for async Chrome API calls
export type ChromeCallback<T> = (result: T) => void;

// Type guard for checking if chrome API is available
export function isChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id !== undefined;
}
