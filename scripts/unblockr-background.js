var sendMessage = function(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, callback);
    });
}

sendMessage('areThereBlockers?', function(thereAreBlockers) {
    if (thereAreBlockers === true) {
        chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
            chrome.pageAction.show(tabId);
        });

        chrome.pageAction.onClicked.addListener(function() {
            sendMessage('removeBlockersNow!');
        });
    }
});
