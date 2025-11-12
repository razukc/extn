// Background service worker
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Initialize storage
  chrome.storage.local.set({ count: 0 }, () => {
    console.log('Storage initialized');
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  if (request.action === 'buttonClicked') {
    // Increment counter
    chrome.storage.local.get(['count'], (result) => {
      const newCount = (result.count || 0) + 1;
      chrome.storage.local.set({ count: newCount }, () => {
        sendResponse({ success: true, count: newCount });
      });
    });
    
    // Return true to indicate async response
    return true;
  }
  
  sendResponse({ success: false, message: 'Unknown action' });
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});
