chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
    chrome.pageAction.show(tabId);
});

chrome.pageAction.onClicked.addListener(function(){
    chrome.tabs.executeScript(null, { file: "scripts/mlst.js" });
    chrome.tabs.executeScript(null, { file: "scripts/unmodalit.js" });
});