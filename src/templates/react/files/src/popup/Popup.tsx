import { useState, useEffect } from 'react';

export function Popup() {
  const [count, setCount] = useState(0);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    // Load saved count from storage
    chrome.storage.local.get(['count'], (result) => {
      if (result.count) setCount(result.count);
    });

    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentTab(tabs[0]);
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <h1>{{projectName}}</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      {currentTab && (
        <p>Current tab: {currentTab.title}</p>
      )}
    </div>
  );
}
