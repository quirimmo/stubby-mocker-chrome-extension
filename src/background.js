'use strict';

// default window options
const DEFAULT_WINDOW_OPTIONS = {
    url: './src/background.html',
    type: 'popup',
    focused: true,
    top: 0,
    left: 0,
    width: 1200,
    height: 800
};

// listener for messages received from other scripts
chrome.runtime.onMessage.addListener(onMessageReceived);

function onMessageReceived(request, sender, sendResponse) {
    switch (request.directive) {
        case 'clicked-extension-button':
            onExtensionButtonClicked(sendResponse, request);
            break;
        case 'current-tab':
            onCurrentTabRequest(sendResponse, request);
        default:
            break;
    }
}

// references to opened windows
let windowReferences = [];

function onExtensionButtonClicked(sendResponse, request) {
    if (!windowReferences.find(el => el.tab.id === request.tab.id)) {
        createMainWindow(sendResponse, request);
    } else {
        focusMainWindow(sendResponse, request);
    }
}

function createMainWindow(sendResponse, request) {
    chrome.windows.create(DEFAULT_WINDOW_OPTIONS, onMainWindowCreated);
    chrome.windows.onRemoved.addListener(onWindowsRemoved);

    function onMainWindowCreated(window) {
        windowReferences.push({
            tab: request.tab,
            window: window
        });
        sendResponse({});
    }

    function onWindowsRemoved(id) {
        let ind = windowReferences.findIndex(el => el.window.id === id);
        if (ind > -1) {
            chrome.debugger.onEvent.removeListener(windowReferences[ind].networkListener);
            chrome.debugger.detach({
                tabId: windowReferences[ind].tab.id
            }, onDetach.bind(null, windowReferences[ind].tab.id));
            windowReferences.splice(ind, 1);
        }
    }
}

function focusMainWindow(sendResponse, request) {
    let currentWindow = windowReferences.find(el => el.tab.id === request.tab.id);
    chrome.windows.update(currentWindow.window.id, {
        focused: true
    }, sendResponse.bind(null, {}));
}

function onCurrentTabRequest(sendResponse, request) {
    let lastWindow = windowReferences[windowReferences.length - 1];
    chrome.debugger.attach({
        tabId: lastWindow.tab.id
    }, '1.0', onAttach.bind(null, lastWindow.tab.id));
    sendResponse({
        tab: lastWindow.tab
    });
}

function onAttach(tabId) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    console.log('Debugger attached');
    enableNetworkDebugger(tabId);
}

function enableNetworkDebugger(tabId) {
    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Network.enable", {}, onNetworkEnabled);

    function onNetworkEnabled(resp) {
        console.log('Network enabled on debugger');
        let ref = windowReferences.find(el => el.tab.id === tabId);
        ref.networkListener = allEventHandler.bind(null, tabId);
        chrome.debugger.onEvent.addListener(ref.networkListener);
    }
}

function allEventHandler(tabId, debuggerId, message, params) {
    if (tabId === debuggerId.tabId) {
        if (isNetworkResponseReceived()) {
            if (isXHRResponse()) {
                manageNetworkResponse(tabId, params);
            }
        }
    }

    function isNetworkResponseReceived() {
        return message === "Network.responseReceived";
    }

    function isXHRResponse() {
        return params.type === "XHR";
    }

}

function manageNetworkResponse(tabId, params) {
    chrome.debugger.sendCommand({
        tabId
    }, 'Network.getResponseBody', {
        requestId: params.requestId
    }, onResponseReceived);

    function onResponseReceived(xhrResponse) {
        chrome.runtime.sendMessage({directive: 'network-request-response', params: params, response: xhrResponse}, function(response) {});
        console.log(params);
        console.log(xhrResponse);
    }
}


function onDetach(debuggerId) {
    console.log(`Detached the debugger associated to: ${debuggerId}`);
}