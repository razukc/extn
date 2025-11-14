// Background service worker for Chrome extension
// Handles extension lifecycle events and message passing

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({ count: 0 });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  console.log('From sender:', sender);
  
  // Handle different message types
  if (message.type === 'GET_COUNT') {
    chrome.storage.local.get(['count'], (result) => {
      sendResponse({ count: result.count || 0 });
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'INCREMENT_COUNT') {
    chrome.storage.local.get(['count'], (result) => {
      const newCount = (result.count || 0) + 1;
      chrome.storage.local.set({ count: newCount }, () => {
        sendResponse({ count: newCount });
      });
    });
    return true; // Keep message channel open for async response
  }
  
  // Default response for unknown message types
  sendResponse({ status: 'ok' });
  return true;
});

// Listen for tab updates to track navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only log when page has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab loaded:', tab.url);
    console.log('Tab ID:', tabId);
  }
});
