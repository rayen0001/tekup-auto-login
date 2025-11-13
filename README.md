# 🔐 TEK-UP Auto Login Extension

A Chrome extension that automatically logs you into the TEK-UP captive portal WiFi network.

## ✨ Features

- **Automatic Login**: Instantly logs you in when the captive portal page loads
- **Secure Storage**: Credentials stored securely using Chrome's sync storage
- **Beautiful UI**: Modern, gradient-styled interface
- **Toggle On/Off**: Enable or disable auto-login anytime
- **Quick Access Popup**: View status and control settings from toolbar
- **Retry Logic**: Automatic retries if login fields aren't immediately found
- **Password Visibility**: Toggle password visibility in settings
- **Cross-device Sync**: Settings sync across your Chrome browsers (if signed in)

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone all files to a folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the folder containing the extension files
6. The extension icon should appear in your toolbar

### Method 2: Create Icons (Required)

The extension needs icon files. Create three PNG icons:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any image editor or online tool to create these. Suggested icon: 🔐 lock emoji or TEK-UP logo.

## 🚀 Usage

### First Time Setup

1. Click the extension icon in your Chrome toolbar
2. Click "Settings" or right-click icon → "Options"
3. Enter your TEK-UP username
4. Enter your TEK-UP password
5. Make sure "Enable Auto-Login" is checked
6. Click "Save Credentials"

### Daily Use

1. Connect to TEK-UP WiFi network
2. Open any webpage - you'll be redirected to the login portal
3. The extension will automatically fill in your credentials and log you in
4. You're connected! 🎉

### Managing Settings

**From Popup:**
- Click extension icon to see current status
- Toggle auto-login on/off quickly
- View your username (partially masked)
- Click "Test Login" to reload login page

**From Settings Page:**
- Update username/password anytime
- Toggle password visibility with eye icon
- Clear all saved data with "Clear All Data" button
- Enable/disable auto-login feature

## 📁 File Structure

```
tek-up-autologin/
├── manifest.json          # Extension configuration
├── autologin.js          # Main auto-login logic
├── background.js         # Background service worker
├── options.html          # Settings page UI
├── options.js            # Settings page logic
├── popup.html            # Toolbar popup UI
├── popup.js              # Toolbar popup logic
├── icon16.png           # Small icon (16x16)
├── icon48.png           # Medium icon (48x48)
├── icon128.png          # Large icon (128x128)
└── README.md            # This file
```

## 🔒 Security & Privacy

- **Local Storage Only**: Credentials are stored locally on your device
- **Chrome Sync**: Uses Chrome's secure sync storage (encrypted)
- **No External Servers**: No data is sent to any external servers
- **No Tracking**: Extension doesn't track or collect any usage data
- **Open Source**: All code is visible and auditable

## 🛠️ Technical Details

### Supported Portal URLs
- `*://cp_login.tekup/*`
- `*://*/cp_login.tekup/*`

### Technologies Used
- Manifest V3 (latest Chrome extension standard)
- Chrome Storage API
- Chrome Scripting API
- Vanilla JavaScript (no dependencies)
- Modern CSS with gradients and animations

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Brave (Chromium-based)
- Any Chromium-based browser with Manifest V3 support

## 🐛 Troubleshooting

### Extension Not Working?

1. **Check if enabled**: Click extension icon and verify toggle is ON
2. **Verify credentials**: Go to Settings and confirm username/password are correct
3. **Check console**: Open DevTools (F12) and look for `[TEK-UP AutoLogin]` messages
4. **Reload page**: Try manually refreshing the login page
5. **Reinstall**: Remove and reinstall the extension

### Login Fails?

- Verify your credentials are correct in TEK-UP system
- Check if portal page has changed (different field names)
- Look for error messages in browser console
- Try manual login first to confirm credentials work

### Fields Not Detected?

The extension looks for these field patterns:
- Username: `#auth_user`, `input[name="auth_user"]`, etc.
- Password: `#auth_pass`, `input[name="auth_pass"]`, etc.
- Submit: `#login`, `button[type="submit"]`, etc.

If the portal changes, these selectors may need updating.

## 🔄 Updates & Maintenance

### Version History
- **v1.1.0**: Complete rewrite with modern UI, popup, and enhanced features
- **v1.0.0**: Initial release

### Future Enhancements
- [ ] Multiple profile support
- [ ] Login success notifications
- [ ] Statistics (login count, success rate)
- [ ] Dark mode support
- [ ] Export/import settings

## 👨‍💻 Development

### Making Changes

1. Edit the files as needed
2. Go to `chrome://extensions/`
3. Click reload icon on the extension card
4. Test your changes

### Debugging

- **Content Script**: Check page console (F12)
- **Background Worker**: Go to `chrome://extensions/` → Click "service worker"
- **Popup**: Right-click popup → "Inspect"
- **Options Page**: Right-click options page → "Inspect"

### Adding Features

The extension is modular:
- `autologin.js` - Core login logic
- `background.js` - Background tasks and monitoring
- `popup.js` - Quick access interface
- `options.js` - Full settings management

## 📄 License

This project is free to use and modify for personal and educational purposes.

## 🤝 Contributing

Suggestions and improvements are welcome! Feel free to:
- Report issues
- Suggest features
- Submit improvements

## ⚠️ Disclaimer

This extension is for convenience only. Always ensure you're following your institution's acceptable use policies. Keep your credentials secure and don't share them with others.

---

**Made with ❤️ from TEK-UP Student for TEK-UP Students**

*Stay connected, stay productive!* 🚀