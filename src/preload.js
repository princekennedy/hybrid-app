const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Get current configuration
  getConfig: () => {
    ipcRenderer.send('get-config');
  },
  
  // Listen for config data
  onConfigData: (callback) => {
    ipcRenderer.on('config-data', (event, data) => callback(data));
  },
  
  // Save settings
  saveSettings: (config) => {
    ipcRenderer.send('save-settings', config);
  },
  
  // Listen for save confirmation
  onSettingsSaved: (callback) => {
    ipcRenderer.on('settings-saved', (event, result) => callback(result));
  },
  
  // Select logo file
  selectLogo: async () => {
    return await ipcRenderer.invoke('select-logo');
  }
});

