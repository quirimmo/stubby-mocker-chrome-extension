'use strict';

// default window options
const DEFAULT_WINDOW_OPTIONS = {
    url: 'background.html',
    type: 'popup',
    focused: true,
    top: 0,
    left: 0,
    width: 1024,
    height: 768
};

// reference to the main window
let windowReference;
// reference to the current tab
let currentTab;
// listener for messages received from other scripts
chrome.runtime.onMessage.addListener(onMessageReceived);

function onMessageReceived(request, sender, sendResponse) {
    currentTab = request.tab;
    switch (request.directive) {
        case 'clicked-extension-button':
            onExtensionButtonClicked(sendResponse);
            break;
        default:
            onNotExpectedMessage(request, sender);
            break;
    }
}

function onExtensionButtonClicked(sendResponse) {
    if (!windowReference) {
        createMainWindow(sendResponse);
        return;
    }
    // get the main window reference in order to check if it is open or not
    chrome.windows.get(windowReference.id, getChromeWindow);

    function getChromeWindow(chromeWindow) {
        // if the main window is open, focus the main window and return
        if (!chrome.runtime.lastError && chromeWindow) {
            focusMainWindow(sendResponse);
            return;
        }
        // otherwise create the main window
        createMainWindow(sendResponse);
    }
}

function focusMainWindow(sendResponse) {
    chrome.windows.update(windowReference.id, {
        focused: true
    }, sendResponse.bind(null, {}));
}

function createMainWindow(sendResponse) {
    chrome.windows.create(DEFAULT_WINDOW_OPTIONS, onMainWindowCreated);

    function onMainWindowCreated(window) {
        windowReference = window;
        sendResponse({});
    }
}

function onNotExpectedMessage(request, sender) {
    let msg = `Unmatched request of ${request} from ${sender}`;
    alert(msg);
    throw new Error(msg);
}