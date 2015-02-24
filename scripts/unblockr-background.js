var sendMessage = function(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, callback);
    });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request && request.init && request.blockrs) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.pageAction.show(tabs[0].id);
            });

            chrome.pageAction.onClicked.addListener(function() {
                sendMessage('removeBlockersNow!');
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    chrome.pageAction.hide(tabs[0].id);
                });
            });
        }

    });
