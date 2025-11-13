# React Extension Manual Testing Guide

## Test Environment
- **Extension**: test-react-extension
- **Build Location**: test-react-extension/dist
- **Chrome Version**: Latest stable
- **Test Date**: 2025-11-13

## Prerequisites
- Chrome browser installed
- Extension built in `test-react-extension/dist` directory
- Chrome Developer Mode enabled

## Test Procedures

### Setup: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `test-react-extension/dist` directory
5. Verify extension appears in the extensions list

**Expected Result**: Extension loads without errors, icon appears in toolbar

---

### Test 1: Popup Opens and Displays Correctly

**Objective**: Verify the popup UI renders correctly with React components

**Steps**:
1. Click the extension icon in Chrome toolbar
2. Observe the popup window that opens

**Expected Results**:
- Popup window opens (approximately 300px wide)
- Extension name is displayed as heading
- Count value is displayed (initially 0)
- "Increment" button is visible and styled
- Current tab information is displayed
- No console errors in popup DevTools

**How to Check**:
- Right-click extension icon → "Inspect popup" to open DevTools
- Check Console tab for any errors
- Check Elements tab to verify React components rendered

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record any observations, errors, or issues here]
```

---

### Test 2: Count Increment with chrome.storage

**Objective**: Verify state management and chrome.storage.local integration

**Steps**:
1. Open the extension popup
2. Note the initial count value
3. Click the "Increment" button
4. Observe the count value updates
5. Close the popup
6. Reopen the popup
7. Verify the count persists

**Expected Results**:
- Count increments by 1 each click
- UI updates immediately (React state)
- Count persists after closing/reopening popup
- No console errors

**How to Verify Storage**:
1. Open popup DevTools (right-click icon → "Inspect popup")
2. Go to Application tab → Storage → Local Storage
3. Check for stored count value
4. Or run in console: `chrome.storage.local.get(['count'], console.log)`

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record count values, storage data, any issues]
```

---

### Test 3: Content Script Injection

**Objective**: Verify React content script injects and renders on web pages

**Steps**:
1. Navigate to any website (e.g., https://example.com)
2. Observe the page after it loads
3. Look for the extension's content script UI

**Expected Results**:
- A small overlay appears in the top-right corner of the page
- Overlay contains text "Extension loaded!"
- Overlay has a "Close" button
- Overlay is styled with white background and border
- Clicking "Close" removes the overlay

**How to Check**:
1. Open page DevTools (F12)
2. Check Console for any content script errors
3. Check Elements tab for `<div id="extn-react-content">` element
4. Verify React components are rendered inside

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record which URLs tested, any injection issues]
```

---

### Test 4: Background Service Worker

**Objective**: Verify background service worker initializes and handles events

**Steps**:
1. Go to `chrome://extensions/`
2. Find the test extension
3. Click "service worker" link (or "Inspect views: service worker")
4. Observe the service worker DevTools console

**Expected Results**:
- Service worker console opens
- "Extension installed" message appears (on first install)
- No errors in console
- Service worker remains active

**Additional Checks**:
1. Navigate to a new tab/URL
2. Check service worker console for "Tab loaded: [URL]" messages
3. Send a test message from popup:
   - Open popup DevTools console
   - Run: `chrome.runtime.sendMessage({test: 'hello'}, console.log)`
   - Check service worker console for "Message received" log

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record console messages, any errors or unexpected behavior]
```

---

### Test 5: Hot Module Replacement (HMR)

**Objective**: Verify development workflow with live updates

**Steps**:
1. Run `npm run dev` in test-react-extension directory
2. Make a change to `src/popup/Popup.tsx` (e.g., change button text)
3. Save the file
4. Observe the popup (keep it open)

**Expected Results**:
- Vite dev server starts successfully
- Changes appear in popup without manual reload
- No errors in console
- Extension remains functional after HMR update

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record HMR behavior, any reload issues]
```

---

### Test 6: TypeScript Type Safety

**Objective**: Verify TypeScript types work correctly for Chrome APIs

**Steps**:
1. Open `src/popup/Popup.tsx` in editor
2. Verify TypeScript recognizes `chrome.storage.local` types
3. Verify TypeScript recognizes `chrome.tabs.Tab` type
4. Run `npm run type-check` in test-react-extension

**Expected Results**:
- No TypeScript errors
- IDE provides autocomplete for Chrome APIs
- Type checking passes

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes**:
```
[Record any type errors or issues]
```

---

## Test Summary

### Overall Results

| Test | Status | Notes |
|------|--------|-------|
| 1. Popup Display | ⬜ | |
| 2. Count Increment | ⬜ | |
| 3. Content Script | ⬜ | |
| 4. Background Worker | ⬜ | |
| 5. HMR | ⬜ | |
| 6. TypeScript | ⬜ | |

### Issues Found

```
[List any bugs, errors, or unexpected behavior]
```

### Recommendations

```
[Suggest any improvements or fixes needed]
```

---

## Quick Test Commands

```bash
# Build the extension
cd test-react-extension
npm run build

# Start dev mode with HMR
npm run dev

# Type check
npm run type-check

# Check storage from popup console
chrome.storage.local.get(null, console.log)

# Send test message from popup console
chrome.runtime.sendMessage({test: 'hello'}, console.log)
```

## Troubleshooting

### Extension Won't Load
- Check for errors in `chrome://extensions/`
- Verify manifest.json is valid
- Check dist directory contains all files

### Popup Won't Open
- Check for JavaScript errors in popup DevTools
- Verify popup.html exists in dist
- Check manifest.json has correct popup path

### Content Script Not Injecting
- Check content script permissions in manifest
- Verify web_accessible_resources are configured
- Check page console for errors
- Try reloading the page

### Service Worker Inactive
- Click "service worker" link to wake it up
- Check for errors in service worker console
- Verify background.ts compiled correctly

### HMR Not Working
- Ensure dev server is running
- Check Vite console for errors
- Try hard refresh (Ctrl+Shift+R)
- Reload extension in chrome://extensions/
