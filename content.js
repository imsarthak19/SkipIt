// Global state to track if extension is enabled
let extensionEnabled = false; // Default OFF

// Load the extension state from storage
chrome.storage.local.get(['extensionEnabled'], (result) => {
  extensionEnabled = result.extensionEnabled || false; // Default to false
  if (extensionEnabled) {
    startAdDetection();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleExtension') {
    extensionEnabled = request.enabled;
    console.log('YouTube Ad Speedup:', extensionEnabled ? 'ON' : 'OFF');
    
    if (extensionEnabled) {
      startAdDetection();
    } else {
      stopAdDetection();
      resetVideoSpeed();
    }
  }
});

// Function to check if YouTube ad is playing
function isAdPlaying() {
  const player = document.querySelector('.html5-video-player');
  return player && player.classList.contains('ad-showing');
}

// Function to get the video element
function getVideoElement() {
  return document.querySelector('.html5-video-player video');
}

// Function to speed up video to 10x
function speedUpVideo() {
  const video = getVideoElement();
  if (video && video.playbackRate !== 3) {
    video.playbackRate = 3;
    console.log('Ad detected - speeding up to 10x');
  }
}

// Function to reset video speed to 1x
function resetVideoSpeed() {
  const video = getVideoElement();
  if (video && video.playbackRate !== 1) {
    video.playbackRate = 1;
    console.log('Ad ended - reset to 1x');
  }
}

// Main function to handle ad detection and speed control
function handleAdDetection() {
  if (!extensionEnabled) return;
  
  if (isAdPlaying()) {
    speedUpVideo();
  } else {
    resetVideoSpeed();
  }
}

// Observer for detecting changes
let observer;

function startAdDetection() {
  if (observer) return; // Already running
  
  // Initial check
  handleAdDetection();
  
  // Set up observer for class changes
  observer = new MutationObserver(() => {
    handleAdDetection();
  });
  
  const player = document.querySelector('.html5-video-player');
  if (player) {
    observer.observe(player, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

function stopAdDetection() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
