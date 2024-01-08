chrome.runtime.onInstalled.addListener(() => {
  // When the extension is installed or upgraded...
  chrome.storage.local.set({ conversations: [] }, () => {
    console.log('Default conversations storage is initialized.');
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'saveConversation') {
    // Save the conversation to local storage
    chrome.storage.local.get({ conversations: [] }, (data) => {
      const newConversations = [...data.conversations, request.conversation];
      chrome.storage.local.set({ conversations: newConversations }, () => {
        console.log('Conversation saved.');
        sendResponse({ status: 'success' });
      });
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

chrome.action.onClicked.addListener((tab) => {
  // When the extension's icon is clicked, inject content.js into the current page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});