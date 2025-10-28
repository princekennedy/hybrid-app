const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let config;

const configPath = path.join(__dirname, 'config.json');

// Load configuration
function loadConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(data);
  } catch (error) {
    console.error('Error loading config:', error);
    // Use default config
    config = {
      appName: 'My Web App',
      appUrl: 'https://google.com',
      appLogo: path.join(__dirname, 'assets', 'default-logo.png')
    };
  }
}

// Save configuration
function saveConfig(newConfig) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    config = newConfig;
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

// Create main window
function createMainWindow() {
  loadConfig();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: config.appLogo,
    title: config.appName,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  // Maximize window on startup
  mainWindow.maximize();
  mainWindow.show();

  // Load the configured URL
  mainWindow.loadURL(config.appUrl).catch(() => {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'no-connection.html'));
  });

  // Handle load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    if (errorCode !== -3) { // -3 is aborted, which is normal during navigation
      console.error('Failed to load:', errorDescription);
      mainWindow.loadFile(path.join(__dirname, 'renderer', 'no-connection.html'));
    }
  });

  // Create menu
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create settings window
function openSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 500,
    parent: mainWindow,
    modal: true,
    title: 'Settings',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'renderer', 'settings.html'));

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Settings',
          click: openSettingsWindow
        },
        {
          label: 'Reload Web App',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          role: 'quit'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.on('get-config', (event) => {
  event.reply('config-data', config);
});

ipcMain.on('save-settings', (event, newConfig) => {
  const success = saveConfig(newConfig);
  
  if (success) {
    event.reply('settings-saved', { success: true });
    
    // Close settings window
    if (settingsWindow) {
      settingsWindow.close();
    }
    
    // Relaunch the app to apply new settings
    setTimeout(() => {
      app.relaunch();
      app.exit(0);
    }, 500);
  } else {
    event.reply('settings-saved', { success: false, error: 'Failed to save configuration' });
  }
});

ipcMain.handle('select-logo', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const sourcePath = result.filePaths[0];
    const fileName = path.basename(sourcePath);
    const destPath = path.join(__dirname, 'assets', fileName);
    
    try {
      // Copy file to assets folder
      fs.copyFileSync(sourcePath, destPath);
      return { success: true, path: destPath };
    } catch (error) {
      console.error('Error copying logo:', error);
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, canceled: true };
});

// App lifecycle
app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

