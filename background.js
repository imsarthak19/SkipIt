// Background script for message relay
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Relay messages between popup and content scripts
  if (request.action === 'toggleExtension') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request);
      }
    });
  }
});
