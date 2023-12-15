document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    const conversationsList = document.getElementById('conversationsList');

    saveButton.addEventListener('click', function() {
        saveConversation();
    });

    function saveConversation() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: captureConversation
            }, (injectionResults) => {
                for (const frameResult of injectionResults)
                    if (frameResult.result) {
                        chrome.storage.local.get({conversations: []}, function(data) {
                            const conversations = data.conversations;
                            const newConversation = {url: tabs[0].url, content: frameResult.result, date: new Date().toISOString()};
                            conversations.push(newConversation);
                            chrome.storage.local.set({conversations: conversations}, function() {
                                loadConversations();
                            });
                        });
                    }
            });
        });
    }

    function captureConversation() {
        const chatMessages = document.querySelectorAll('div.message'); // Replace with actual selector for ChatGPT messages
        return Array.from(chatMessages).map(msg => msg.innerText || msg.textContent);
    }

    function loadConversations() {
        chrome.storage.local.get({conversations: []}, function(data) {
            const conversations = data.conversations;
            conversationsList.innerHTML = '';
            conversations.forEach(function(conversation) {
                const listItem = document.createElement('li');
                listItem.textContent = `URL: ${conversation.url} - ${conversation.date}`;
                listItem.className = 'conversation-item';
                conversationsList.appendChild(listItem);
            });
        });
    }

    loadConversations();
});