// content.js

function captureConversation() {
  // This function will be called to capture the current conversation on the page
  const conversationElements = document.querySelectorAll('.chat-message'); // Replace '.chat-message' with the actual selector for chat messages
  const conversation = Array.from(conversationElements).map(element => {
    return {
      text: element.innerText,
      timestamp: new Date().toISOString()
    };
  });

  return conversation;
}

function sendConversationToBackground(conversation) {
  // Send the captured conversation to the background script
  chrome.runtime.sendMessage({ type: 'saveConversation', conversation });
}

// Add a listener for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'captureConversation') {
    const conversation = captureConversation();
    sendConversationToBackground(conversation);
    sendResponse({ status: 'success', message: 'Conversation captured' });
  }
});

// Optionally, you can add a mutation observer or event listener to automatically capture conversations
// when a new message is added to the chat. This is an example using MutationObserver.
const chatContainer = document.querySelector('.chat-container'); // Replace '.chat-container' with the actual selector for the chat container
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      const conversation = captureConversation();
      sendConversationToBackground(conversation);
    }
  });
});

// Start observing for changes in the chat container
observer.observe(chatContainer, { childList: true });