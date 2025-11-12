// Popup functionality
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('actionButton');
  const output = document.getElementById('output');

  button.addEventListener('click', () => {
    output.textContent = 'Button clicked! Extension is working.';
    
    // Example: Send message to background script
    chrome.runtime.sendMessage({ action: 'buttonClicked' }, (response) => {
      console.log('Response from background:', response);
    });
  });

  // Example: Get data from storage
  chrome.storage.local.get(['count'], (result) => {
    const count = result.count || 0;
    console.log('Current count:', count);
  });
});
