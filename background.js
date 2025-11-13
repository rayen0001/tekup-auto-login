// Background service worker
'use strict';

/**
 * Extension installation/update handler
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[TEK-UP AutoLogin] Extension installed/updated', details.reason);
  
  if (details.reason === 'install') {
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});

/**
 * Listen for messages from content scripts or popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[TEK-UP AutoLogin] Message received:', request);

  switch (request.action) {
    case 'getCredentials':
      // Retrieve credentials from storage
      chrome.storage.sync.get(['username', 'password', 'enabled'], (data) => {
        sendResponse(data);
      });
      return true; // Keep channel open for async response

    case 'loginSuccess':
      console.log('[TEK-UP AutoLogin] Login successful for:', request.username);
      // Could add notification here if desired
      break;

    case 'loginFailed':
      console.error('[TEK-UP AutoLogin] Login failed:', request.error);
      // Could add notification here if desired
      break;

    default:
      console.warn('[TEK-UP AutoLogin] Unknown action:', request.action);
  }
});

/**
 * Monitor tab updates to detect login page
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only act when page finishes loading
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('cp_login.tekup')) {
      console.log('[TEK-UP AutoLogin] Login page detected on tab', tabId);
      
      // Inject content script if not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['autologin.js']
      }).catch(err => {
        console.error('[TEK-UP AutoLogin] Script injection failed:', err);
      });
    }
  }
});

/**
 * Handle storage changes
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('[TEK-UP AutoLogin] Settings changed:', Object.keys(changes));
    
    if (changes.enabled) {
      const enabled = changes.enabled.newValue;
      console.log(`[TEK-UP AutoLogin] Auto-login ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
});

console.log('[TEK-UP AutoLogin] Background service worker initialized');