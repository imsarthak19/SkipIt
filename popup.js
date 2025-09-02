// Get DOM elements
const toggleSwitch = document.getElementById('toggleSwitch');
const status = document.getElementById('status');

// Load the current state when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['extensionEnabled'], (result) => {
    const isEnabled = result.extensionEnabled || false; // Default to false (OFF)
    updateUI(isEnabled);
  });
});

// Handle toggle switch click
toggleSwitch.addEventListener('click', () => {
  chrome.storage.local.get(['extensionEnabled'], (result) => {
    const currentState = result.extensionEnabled || false;
    const newState = !currentState;
    
    // Save the new state
    chrome.storage.local.set({ extensionEnabled: newState });
    
    // Update UI
    updateUI(newState);
    
    // Send message to background script to relay to content script
    chrome.runtime.sendMessage({ 
      action: 'toggleExtension', 
      enabled: newState 
    });
  });
});

// Update the UI based on the current state
function updateUI(isEnabled) {
  if (isEnabled) {
    toggleSwitch.classList.add('active');
    status.textContent = 'ON';
    status.className = 'status enabled';
  } else {
    toggleSwitch.classList.remove('active');
    status.textContent = 'OFF';
    status.className = 'status disabled';
  }
}
