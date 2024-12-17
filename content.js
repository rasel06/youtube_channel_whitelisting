// Monitor the DOM and hide videos from non-whitelisted channels

let whitelistedChannels = []; // Array to store whitelisted channel IDs

// Load the whitelist from storage
chrome.storage.local.get("whitelistedChannels", (data) => {
  whitelistedChannels = data.whitelistedChannels || [];
  hideNonWhitelistedVideos();
});

// Function to check if a channel is whitelisted
function isWhitelisted(channelId) {
  return whitelistedChannels.includes(channelId);
}

// Function to hide non-whitelisted videos
function hideNonWhitelistedVideos() {
  const videoLinks = document.querySelectorAll('a[href^="/channel/"]');

  videoLinks.forEach((link) => {
    const channelId = link.getAttribute("href").split("/")[2];
    const videoElement = link.closest(
      "ytd-video-renderer, ytd-grid-video-renderer"
    );

    if (videoElement && !isWhitelisted(channelId)) {
      videoElement.style.display = "none"; // Hide the video
    }
  });
}

// Observer to handle dynamic loading of videos
const observer = new MutationObserver(() => {
  hideNonWhitelistedVideos();
});

observer.observe(document.body, { childList: true, subtree: true });
