'use strict';

let currentTab;
const version = "1.0";
const queryInfo = {
    active: true,
    currentWindow: true
};
let _this = this;

chrome.tabs.query(queryInfo, function(tabs) {
    currentTab = tabs[0];
    chrome.runtime.sendMessage({directive: 'clicked-extension-button', tab: currentTab}, function(response) {
        _this.close();
    });
    chrome.storage.local.set({'TEST': 'POPUP TEST'});
});