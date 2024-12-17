const channelIdInput = document.getElementById("channelId");
const addChannelButton = document.getElementById("addChannel");
const whitelistElement = document.getElementById("whitelist");

// Load the whitelist and display it
chrome.storage.local.get("whitelistedChannels", (data) => {
  const channels = data.whitelistedChannels || [];
  channels.forEach(addChannelToUI);
});

// Add a new channel to the whitelist
addChannelButton.addEventListener("click", () => {
  const channelId = channelIdInput.value.trim();
  if (channelId) {
    chrome.storage.local.get("whitelistedChannels", (data) => {
      const channels = data.whitelistedChannels || [];
      if (!channels.includes(channelId)) {
        channels.push(channelId);
        chrome.storage.local.set({ whitelistedChannels: channels }, () => {
          addChannelToUI(channelId);
          channelIdInput.value = "";
        });
      }
    });
  }
});

// Add a channel to the UI
function addChannelToUI(channelId) {
  const li = document.createElement("li");

  // Channel display
  const channelText = document.createElement("span");
  channelText.textContent = channelId;

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit";
  editButton.onclick = () => {
    const newChannelId = prompt("Edit Channel ID:", channelId);
    if (newChannelId && newChannelId.trim() !== channelId) {
      updateChannel(channelId, newChannelId.trim());
    }
  };

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete";
  deleteButton.onclick = () => {
    var conf = confirm("Really want to delete ?");

    if (conf) {
      removeChannel(channelId);
      li.remove();
    }
  };

  li.appendChild(channelText);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  whitelistElement.appendChild(li);
}

// Remove a channel from storage
function removeChannel(channelId) {
  chrome.storage.local.get("whitelistedChannels", (data) => {
    const channels = data.whitelistedChannels || [];
    const updatedChannels = channels.filter((id) => id !== channelId);
    chrome.storage.local.set({ whitelistedChannels: updatedChannels });
  });
}

// Update a channel ID
function updateChannel(oldId, newId) {
  chrome.storage.local.get("whitelistedChannels", (data) => {
    let channels = data.whitelistedChannels || [];
    const index = channels.indexOf(oldId);
    if (index !== -1) {
      channels[index] = newId;
      chrome.storage.local.set({ whitelistedChannels: channels }, () => {
        whitelistElement.innerHTML = "";
        channels.forEach(addChannelToUI);
      });
    }
  });
}
