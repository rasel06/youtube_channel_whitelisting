// Listen for storage changes and notify content scripts
chrome.storage.onChanged.addListener((changes) => {
  if (changes.whitelistedChannels) {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id); // Reload YouTube tabs to apply changes
      });
    });
  }
});
