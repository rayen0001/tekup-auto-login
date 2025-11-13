// Popup script
(function() {
  'use strict';

  const elements = {
    status: document.getElementById('statusText'),
    indicator: document.getElementById('statusIndicator'),
    username: document.getElementById('username'),
    toggleEnabled: document.getElementById('toggleEnabled'),
    openSettings: document.getElementById('openSettings'),
    testLogin: document.getElementById('testLogin')
  };

  /**
   * Updates the status display
   */
  function updateStatus(enabled, hasCredentials) {
    if (!hasCredentials) {
      elements.status.textContent = 'Not Configured';
      elements.indicator.className = 'status-indicator inactive';
      elements.username.textContent = 'Not set';
    } else if (enabled) {
      elements.status.textContent = 'Active';
      elements.indicator.className = 'status-indicator active';
    } else {
      elements.status.textContent = 'Disabled';
      elements.indicator.className = 'status-indicator inactive';
    }
  }

  /**
   * Loads current settings
   */
  function loadSettings() {
    try {
      chrome.storage.sync.get(['username', 'password', 'enabled'], (data) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading settings:', chrome.runtime.lastError);
          elements.status.textContent = 'Error';
          elements.indicator.className = 'status-indicator inactive';
          return;
        }

        const hasCredentials = !!(data.username && data.password);
        const enabled = data.enabled !== false;

        // Update UI
        if (data.username) {
          // Show partially masked username
          const masked = data.username.length > 4 
            ? data.username.substring(0, 3) + '***' + data.username.slice(-1)
            : data.username.substring(0, 2) + '***';
          elements.username.textContent = masked;
        }

        elements.toggleEnabled.checked = enabled;
        updateStatus(enabled, hasCredentials);
      });
    } catch (error) {
      console.error('Error in loadSettings:', error);
      elements.status.textContent = 'Error';
      elements.indicator.className = 'status-indicator inactive';
    }
  }

  /**
   * Toggles auto-login enabled state
   */
  function toggleEnabled(e) {
    const enabled = e.target.checked;
    
    try {
      chrome.storage.sync.set({ enabled }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving enabled state:', chrome.runtime.lastError);
          // Revert toggle
          e.target.checked = !enabled;
          return;
        }

        console.log(`Auto-login ${enabled ? 'enabled' : 'disabled'}`);
        
        // Reload settings to update status
        chrome.storage.sync.get(['username', 'password'], (data) => {
          if (chrome.runtime.lastError) {
            console.error('Error reloading settings:', chrome.runtime.lastError);
            return;
          }
          const hasCredentials = !!(data.username && data.password);
          updateStatus(enabled, hasCredentials);
        });
      });
    } catch (error) {
      console.error('Error in toggleEnabled:', error);
      e.target.checked = !enabled;
    }
  }

  /**
   * Opens the settings page
   */
  function openSettings() {
    try {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // Fallback for browsers that don't support openOptionsPage
        window.open(chrome.runtime.getURL('options.html'));
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }

  /**
   * Tests login on current tab
   */
  function testLogin() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          console.error('Error querying tabs:', chrome.runtime.lastError);
          return;
        }

        if (!tabs || tabs.length === 0) {
          console.error('No active tab found');
          return;
        }

        const currentTab = tabs[0];
        
        // Check if we're on a login page
        if (currentTab.url && currentTab.url.includes('cp_login.tekup')) {
          chrome.tabs.reload(currentTab.id, () => {
            if (chrome.runtime.lastError) {
              console.error('Error reloading tab:', chrome.runtime.lastError);
              return;
            }
            window.close();
          });
        } else {
          // Open the login page
          chrome.tabs.create({ 
            url: 'http://cp_login.tekup/',
            active: true 
          }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error creating tab:', chrome.runtime.lastError);
              return;
            }
            window.close();
          });
        }
      });
    } catch (error) {
      console.error('Error in testLogin:', error);
    }
  }

  /**
   * Initialize popup
   */
  function initialize() {
    try {
      // Load current settings
      loadSettings();

      // Event listeners
      if (elements.toggleEnabled) {
        elements.toggleEnabled.addEventListener('change', toggleEnabled);
      }
      
      if (elements.openSettings) {
        elements.openSettings.addEventListener('click', openSettings);
      }
      
      if (elements.testLogin) {
        elements.testLogin.addEventListener('click', testLogin);
      }

      console.log('Popup initialized successfully');
    } catch (error) {
      console.error('Error initializing popup:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();