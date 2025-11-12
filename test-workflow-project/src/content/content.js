// Content script - runs on web pages
console.log('Content script loaded on:', window.location.href);

// Example: Add a visual indicator that the extension is active
const indicator = document.createElement('div');
indicator.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border-radius: 6px;
  font-family: sans-serif;
  font-size: 12px;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;
indicator.textContent = 'Extension Active';
document.body.appendChild(indicator);

// Remove indicator after 3 seconds
setTimeout(() => {
  indicator.remove();
}, 3000);

// Example: Listen for messages from background or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  sendResponse({ received: true });
});

// Example: Send message to background
chrome.runtime.sendMessage({ 
  action: 'pageLoaded', 
  url: window.location.href 
}, (response) => {
  console.log('Background response:', response);
});
