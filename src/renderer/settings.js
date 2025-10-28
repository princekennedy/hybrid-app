// Load current configuration when page loads
window.addEventListener('DOMContentLoaded', () => {
  // Request config from main process
  window.electronAPI.getConfig();
  
  // Listen for config data
  window.electronAPI.onConfigData((config) => {
    document.getElementById('app-name').value = config.appName || '';
    document.getElementById('app-url').value = config.appUrl || '';
    document.getElementById('app-logo').value = config.appLogo || '';
    
    if (config.appLogo) {
      document.getElementById('logo-path').textContent = config.appLogo;
    }
  });
  
  // Handle logo selection
  document.getElementById('select-logo-btn').addEventListener('click', async () => {
    const result = await window.electronAPI.selectLogo();
    
    if (result.success && result.path) {
      document.getElementById('app-logo').value = result.path;
      document.getElementById('logo-path').textContent = result.path;
    } else if (result.error) {
      showMessage('Error selecting logo: ' + result.error, 'error');
    }
  });
  
  // Handle form submission
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const config = {
      appName: formData.get('appName'),
      appUrl: formData.get('appUrl'),
      appLogo: formData.get('appLogo')
    };
    
    // Validate URL
    try {
      new URL(config.appUrl);
    } catch (error) {
      showMessage('Please enter a valid URL', 'error');
      return;
    }
    
    // Save settings
    window.electronAPI.saveSettings(config);
    showMessage('Saving settings... Application will restart.', 'success');
  });
  
  // Handle cancel button
  document.getElementById('cancel-btn').addEventListener('click', () => {
    window.close();
  });
  
  // Listen for save confirmation
  window.electronAPI.onSettingsSaved((result) => {
    if (result.success) {
      showMessage('Settings saved successfully! Restarting...', 'success');
    } else {
      showMessage('Error saving settings: ' + (result.error || 'Unknown error'), 'error');
    }
  });
});

function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
  messageEl.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }
}

