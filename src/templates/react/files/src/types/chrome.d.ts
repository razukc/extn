/**
 * Chrome API Type Augmentations
 * 
 * This file provides additional type definitions and augmentations for Chrome Extension APIs
 * to improve TypeScript support and enable modern async/await patterns.
 */

// Augment chrome.storage with Promise-based APIs
declare namespace chrome.storage {
  interface StorageArea {
    /**
     * Gets one or more items from storage (Promise-based).
     * @param keys A single key to get, list of keys to get, or a dictionary
     * specifying default values.
     * @returns Promise that resolves with an object containing items.
     */
    get(keys?: string | string[] | { [key: string]: any }): Promise<{ [key: string]: any }>;

    /**
     * Sets multiple items (Promise-based).
     * @param items An object which gives each key/value pair to update storage with.
     * @returns Promise that resolves when the operation is complete.
     */
    set(items: { [key: string]: any }): Promise<void>;

    /**
     * Removes one or more items from storage (Promise-based).
     * @param keys A single key or a list of keys for items to remove.
     * @returns Promise that resolves when the operation is complete.
     */
    remove(keys: string | string[]): Promise<void>;

    /**
     * Removes all items from storage (Promise-based).
     * @returns Promise that resolves when the operation is complete.
     */
    clear(): Promise<void>;
  }
}

// Augment chrome.tabs with Promise-based APIs
declare namespace chrome.tabs {
  /**
   * Gets the tab that this script call is being made from (Promise-based).
   * @returns Promise that resolves with the Tab object.
   */
  function getCurrent(): Promise<Tab>;

  /**
   * Gets details about the specified tab (Promise-based).
   * @param tabId The ID of the tab to get.
   * @returns Promise that resolves with the Tab object.
   */
  function get(tabId: number): Promise<Tab>;

  /**
   * Gets all tabs that have the specified properties (Promise-based).
   * @param queryInfo The properties to query for.
   * @returns Promise that resolves with an array of Tab objects.
   */
  function query(queryInfo: QueryInfo): Promise<Tab[]>;

  /**
   * Creates a new tab (Promise-based).
   * @param createProperties Properties for the new tab.
   * @returns Promise that resolves with the created Tab object.
   */
  function create(createProperties: CreateProperties): Promise<Tab>;

  /**
   * Modifies the properties of a tab (Promise-based).
   * @param tabId The ID of the tab to update.
   * @param updateProperties The properties to update.
   * @returns Promise that resolves with the updated Tab object.
   */
  function update(tabId: number, updateProperties: UpdateProperties): Promise<Tab>;

  /**
   * Removes one or more tabs (Promise-based).
   * @param tabIds The tab ID or array of tab IDs to close.
   * @returns Promise that resolves when the operation is complete.
   */
  function remove(tabIds: number | number[]): Promise<void>;
}

// Augment chrome.runtime with Promise-based APIs
declare namespace chrome.runtime {
  /**
   * Sends a single message to event listeners (Promise-based).
   * @param message The message to send.
   * @returns Promise that resolves with the response from the handler.
   */
  function sendMessage(message: any): Promise<any>;

  /**
   * Sends a single message to event listeners in an extension (Promise-based).
   * @param extensionId The ID of the extension to send the message to.
   * @param message The message to send.
   * @returns Promise that resolves with the response from the handler.
   */
  function sendMessage(extensionId: string, message: any): Promise<any>;
}

// Common Chrome API patterns and utilities

/**
 * Type guard to check if a value is a Chrome runtime error
 */
export function isChromeError(error: unknown): error is chrome.runtime.LastError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Utility type for Chrome message handlers
 */
export type MessageHandler<T = any, R = any> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: R) => void
) => boolean | void;

/**
 * Utility type for Chrome storage change handlers
 */
export type StorageChangeHandler = (
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: chrome.storage.AreaName
) => void;

/**
 * Utility type for Chrome tab update handlers
 */
export type TabUpdateHandler = (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => void;

/**
 * Helper to safely access chrome.storage with error handling
 */
export async function safeStorageGet<T = any>(
  keys: string | string[],
  defaultValue?: T
): Promise<T> {
  try {
    const result = await chrome.storage.local.get(keys);
    const key = typeof keys === 'string' ? keys : keys[0];
    return result[key] ?? defaultValue;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue as T;
  }
}

/**
 * Helper to safely set chrome.storage with error handling
 */
export async function safeStorageSet(items: { [key: string]: any }): Promise<boolean> {
  try {
    await chrome.storage.local.set(items);
    return true;
  } catch (error) {
    console.error('Storage set error:', error);
    return false;
  }
}

/**
 * Helper to safely query tabs with error handling
 */
export async function safeTabsQuery(
  queryInfo: chrome.tabs.QueryInfo
): Promise<chrome.tabs.Tab[]> {
  try {
    return await chrome.tabs.query(queryInfo);
  } catch (error) {
    console.error('Tabs query error:', error);
    return [];
  }
}

/**
 * Helper to get the current active tab
 */
export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  } catch (error) {
    console.error('Get current tab error:', error);
    return null;
  }
}

/**
 * Helper to send a message with error handling
 */
export async function safeSendMessage<T = any>(message: any): Promise<T | null> {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('Send message error:', error);
    return null;
  }
}
