# Electron Web Wrapper - User Guide

## Overview

This Electron application wraps any web application into a desktop app with configurable settings. You can customize the app name, URL, and logo through an easy-to-use settings interface.

## Features

✅ **Load External URLs** - Display any website in a desktop window  
✅ **Configurable Settings** - Change app name, URL, and logo  
✅ **Persistent Configuration** - Settings are saved and persist across restarts  
✅ **Menu Bar Controls** - Access settings and reload functionality  
✅ **Maximized by Default** - App opens maximized for better viewing  
✅ **Offline Handling** - Shows a friendly error page when connection fails  
✅ **Auto-Restart** - App automatically restarts when settings are changed  

## Getting Started

### Installation

1. Make sure you have Node.js installed (version 14 or higher)
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the application with:
```bash
npm start
```

## Using the Application

### First Launch

When you first launch the app, it will load the URL configured in `src/config.json`. By default, this is set to `https://example.com`.

### Accessing Settings

To configure the application:

1. Click on **Application** in the menu bar
2. Select **Settings**
3. The settings window will open

### Configuring Settings

In the settings window, you can configure:

#### 1. Application Name
- Enter the name you want to display in the window title
- Example: "My Company Portal", "Internal Dashboard", etc.

#### 2. Web Application URL
- Enter the full URL of the website you want to load
- Must include `https://` or `http://`
- Example: `https://app.example.com`

#### 3. Application Logo
- Click **Choose Logo File** to select an image
- Supported formats: PNG, JPG, JPEG, GIF, ICO
- The logo will be used as the window icon

### Saving Settings

1. After entering your settings, click **Save Settings**
2. The app will automatically restart to apply the new configuration
3. Your settings are saved in `src/config.json`

### Reloading the Web App

If you need to refresh the loaded website:

1. Click **Application** in the menu bar
2. Select **Reload Web App**

Or use the keyboard shortcut (varies by OS).

### Offline/Connection Issues

If the app cannot connect to the configured URL:
- A friendly "No Connection" page will be displayed
- Click **Retry Connection** to try loading the URL again
- Check your internet connection or verify the URL in settings

## Menu Options

### Application Menu
- **Settings** - Open the settings window
- **Reload Web App** - Refresh the current page
- **Quit** - Close the application

### View Menu
- **Reload** - Reload the current view
- **Force Reload** - Force reload (clear cache)
- **Toggle Developer Tools** - Open DevTools for debugging
- **Reset Zoom** - Reset zoom level to 100%
- **Zoom In** - Increase zoom level
- **Zoom Out** - Decrease zoom level
- **Toggle Full Screen** - Enter/exit full screen mode

## Configuration File

The app stores its configuration in `src/config.json`:

```json
{
  "appName": "My Web App",
  "appUrl": "https://example.com",
  "appLogo": "src/assets/default-logo.svg"
}
```

You can manually edit this file if needed, but it's recommended to use the Settings UI.

## Troubleshooting

### App Won't Start
- Make sure all dependencies are installed: `npm install`
- Check that Node.js is properly installed
- Look for error messages in the terminal

### Website Won't Load
- Verify the URL is correct and includes `https://` or `http://`
- Check your internet connection
- Some websites may block being loaded in an iframe/webview
- Try accessing the URL in a regular browser first

### Settings Won't Save
- Make sure you have write permissions in the project directory
- Check that `src/config.json` exists and is writable
- Look for error messages in the settings window

### Logo Not Displaying
- Ensure the logo file path is correct
- Supported formats: PNG, JPG, JPEG, GIF, ICO
- Try using an absolute path if relative paths don't work

## Development

### Project Structure

```
electron-render/
├── src/
│   ├── main.js              # Main Electron process
│   ├── preload.js           # Preload script for IPC
│   ├── config.json          # Configuration file
│   ├── assets/              # Logo and image files
│   │   └── default-logo.svg
│   └── renderer/            # Renderer process files
│       ├── index.html       # Main window (not used, loads URL directly)
│       ├── settings.html    # Settings UI
│       ├── settings.js      # Settings logic
│       ├── styles.css       # Styles for settings
│       └── no-connection.html # Offline fallback page
├── package.json
└── README.md
```

### Scripts

- `npm start` - Start the application
- `npm run dev` - Start in development mode

## Tips & Best Practices

1. **Use HTTPS URLs** - For better security, use HTTPS URLs when possible
2. **Test URLs First** - Test the URL in a browser before configuring it
3. **Backup Config** - Keep a backup of your `config.json` if you have a specific setup
4. **Logo Size** - Use square logos (256x256 or 512x512) for best results
5. **Network Requirements** - Ensure the target website is accessible from your network

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console output for error messages
3. Open DevTools (View → Toggle Developer Tools) to debug

## License

MIT License - See LICENSE file for details

## Author

Prince Kennedy

