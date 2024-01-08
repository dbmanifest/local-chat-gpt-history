// Saves options to chrome.storage
function saveOptions() {
  var historyEnabled = document.getElementById('historyEnabledCheckbox').checked;
  chrome.storage.sync.set({
    historyEnabled: historyEnabled
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage
function restoreOptions() {
  // Use default value historyEnabled = false.
  chrome.storage.sync.get({
    historyEnabled: false
  }, function(items) {
    document.getElementById('historyEnabledCheckbox').checked = items.historyEnabled;
  });
}

// Event listeners for the save button
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);