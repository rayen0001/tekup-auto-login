// Options page script
(function() {
  'use strict';

  const elements = {
    form: document.getElementById('settingsForm'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    enabled: document.getElementById('enabled'),
    saveBtn: document.getElementById('save'),
    clearBtn: document.getElementById('clear'),
    status: document.getElementById('status'),
    togglePassword: document.getElementById('togglePassword')
  };

  /**
   * Shows status message
   */
  function showStatus(message, type = 'success') {
    elements.status.textContent = message;
    elements.status.className = `status ${type} show`;
    
    setTimeout(() => {
      elements.status.classList.remove('show');
    }, 3000);
  }

  /**
   * Loads saved credentials from storage
   */
  function loadCredentials() {
    chrome.storage.sync.get(['username', 'password', 'enabled'], (data) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading credentials:', chrome.runtime.lastError);
        showStatus('Error loading saved data', 'error');
        return;
      }

      if (data.username) {
        elements.username.value = data.username;
      }
      
      if (data.password) {
        elements.password.value = data.password;
      }

      // Default to enabled if not set
      elements.enabled.checked = data.enabled !== false;
    });
  }

  /**
   * Saves credentials to storage
   */
  function saveCredentials(e) {
    e.preventDefault();

    const username = elements.username.value.trim();
    const password = elements.password.value;
    const enabled = elements.enabled.checked;

    // Validation
    if (!username) {
      showStatus('Please enter a username', 'error');
      elements.username.focus();
      return;
    }

    if (!password) {
      showStatus('Please enter a password', 'error');
      elements.password.focus();
      return;
    }

    // Save to storage
    chrome.storage.sync.set(
      { username, password, enabled },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving credentials:', chrome.runtime.lastError);
          showStatus('Error saving credentials', 'error');
          return;
        }

        showStatus('✓ Credentials saved successfully!', 'success');
        console.log('Credentials saved for user:', username);
      }
    );
  }

  /**
   * Clears all saved data
   */
  function clearData() {
    if (!confirm('Are you sure you want to clear all saved credentials?')) {
      return;
    }

    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing data:', chrome.runtime.lastError);
        showStatus('Error clearing data', 'error');
        return;
      }

      // Reset form
      elements.username.value = '';
      elements.password.value = '';
      elements.enabled.checked = true;

      showStatus('All data cleared successfully', 'success');
      console.log('All credentials cleared');
    });
  }

  /**
   * Toggles password visibility
   */
  function togglePasswordVisibility() {
    const type = elements.password.type === 'password' ? 'text' : 'password';
    elements.password.type = type;
    elements.togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  }

  /**
   * Initialize the options page
   */
  function initialize() {
    // Load saved credentials
    loadCredentials();

    // Event listeners
    elements.form.addEventListener('submit', saveCredentials);
    elements.clearBtn.addEventListener('click', clearData);
    elements.togglePassword.addEventListener('click', togglePasswordVisibility);

    // Enable/disable status change
    elements.enabled.addEventListener('change', (e) => {
      const status = e.target.checked ? 'enabled' : 'disabled';
      console.log(`Auto-login ${status}`);
    });

    console.log('Options page initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();