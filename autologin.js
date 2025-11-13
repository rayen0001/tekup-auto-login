(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    maxRetries: 3,
    retryDelay: 1000,
    fieldCheckDelay: 500
  };

  let retryCount = 0;

  /**
   * Logs messages with timestamp
   */
  function log(message, type = 'info') {
    const prefix = '[TEK-UP AutoLogin]';
    const timestamp = new Date().toLocaleTimeString();
    console[type](`${prefix} [${timestamp}] ${message}`);
  }

  /**
   * Finds login form fields with multiple selector strategies
   */
  function findLoginFields() {
    const selectors = {
      username: [
        '#auth_user',
        'input[name="auth_user"]',
        'input[name="username"]',
        'input[type="text"][name*="user"]',
        'input[placeholder*="username" i]',
        'input[placeholder*="user" i]'
      ],
      password: [
        '#auth_pass',
        'input[name="auth_pass"]',
        'input[name="password"]',
        'input[type="password"]'
      ],
      submit: [
        '#login',
        'button[type="submit"]',
        'input[type="submit"]',
        'button[name="login"]',
        'button.login-btn'
      ],
      checkbox: [
        '#remember',
        'input[type="checkbox"][name*="remember"]',
        '.checkbox input[type="checkbox"]',
        'input[type="checkbox"]'
      ]
    };

    const fields = {};

    // Find username field
    for (const selector of selectors.username) {
      fields.username = document.querySelector(selector);
      if (fields.username) break;
    }

    // Find password field
    for (const selector of selectors.password) {
      fields.password = document.querySelector(selector);
      if (fields.password) break;
    }

    // Find submit button
    for (const selector of selectors.submit) {
      fields.submit = document.querySelector(selector);
      if (fields.submit) break;
    }

    // Find checkbox (optional)
    for (const selector of selectors.checkbox) {
      fields.checkbox = document.querySelector(selector);
      if (fields.checkbox) break;
    }

    return fields;
  }

  /**
   * Fills form fields and submits
   */
  function fillAndSubmit(credentials) {
    const fields = findLoginFields();

    if (!fields.username || !fields.password) {
      log('Login fields not found on page', 'warn');
      
      if (retryCount < CONFIG.maxRetries) {
        retryCount++;
        log(`Retrying in ${CONFIG.retryDelay}ms... (Attempt ${retryCount}/${CONFIG.maxRetries})`);
        setTimeout(() => fillAndSubmit(credentials), CONFIG.retryDelay);
      } else {
        log('Max retries reached. Please check if you\'re on the login page.', 'error');
      }
      return;
    }

    try {
      // Fill username
      fields.username.value = credentials.username;
      fields.username.dispatchEvent(new Event('input', { bubbles: true }));
      fields.username.dispatchEvent(new Event('change', { bubbles: true }));

      // Fill password
      fields.password.value = credentials.password;
      fields.password.dispatchEvent(new Event('input', { bubbles: true }));
      fields.password.dispatchEvent(new Event('change', { bubbles: true }));

      // Check remember me checkbox if available
      if (fields.checkbox && !fields.checkbox.checked) {
        fields.checkbox.checked = true;
        fields.checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }

      log('Credentials filled successfully');

      // Submit form
      if (fields.submit) {
        // Enable button if disabled
        if (fields.submit.disabled) {
          fields.submit.disabled = false;
        }

        // Wait a moment for any form validation
        setTimeout(() => {
          fields.submit.click();
          log('Login form submitted');
        }, CONFIG.fieldCheckDelay);
      } else {
        log('Submit button not found, trying form submit', 'warn');
        const form = fields.username.closest('form');
        if (form) {
          form.submit();
          log('Form submitted directly');
        } else {
          log('Could not submit form', 'error');
        }
      }
    } catch (error) {
      log(`Error during auto-login: ${error.message}`, 'error');
    }
  }

  /**
   * Main execution
   */
  function initialize() {
    log('Extension loaded, checking for credentials...');

    chrome.storage.sync.get(['username', 'password', 'enabled'], (data) => {
      // Check for Chrome runtime errors
      if (chrome.runtime.lastError) {
        log(`Storage error: ${chrome.runtime.lastError.message}`, 'error');
        return;
      }

      // Check if auto-login is enabled (default to true)
      const enabled = data.enabled !== false;
      
      if (!enabled) {
        log('Auto-login is disabled');
        return;
      }

      const username = data.username?.trim();
      const password = data.password;

      if (!username || !password) {
        log('No credentials saved. Please configure in extension settings.', 'warn');
        return;
      }

      log(`Found credentials for user: ${username.substring(0, 3)}***`);
      
      // Wait for DOM to be fully ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          fillAndSubmit({ username, password });
        });
      } else {
        fillAndSubmit({ username, password });
      }
    });
  }

  // Start the extension
  initialize();
})();