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
    chrome.debugger.detach({
        tabId: lastWindow.tab.id
    }, onDetach.bind(null, lastWindow.tab.id));
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
    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Network.enable", {}, onNetworkEnabled);

    function onNetworkEnabled(resp) {
        chrome.debugger.onEvent.addListener(allEventHandler);

        function allEventHandler(debuggerId, message, params) {
            if (tabId != debuggerId.tabId) {
                return;
            }

            if (message == "Network.responseReceived") {
                if (params.type === 'XHR') {
                    chrome.debugger.sendCommand({
                        tabId: tabId
                    }, "Network.getResponseBody", {
                        "requestId": params.requestId
                    }, onResponseReceived);
                }
            }

            function onResponseReceived(xhrResponse) {
                alert(xhrResponse);
                console.log(params);
                console.log(xhrResponse);
            }

        }
    }
}


function onDetach(debuggeeId) {
    // alert('detached');
}


// chrome.debugger.detach({ tabId: currentTab.id });
// chrome.debugger.attach({
//     tabId: currentTab.id
// }, version, function() {
//     if (chrome.runtime.lastError) {
//         console.log(chrome.runtime.lastError.message);
//         return;
//     }
//     chrome.debugger.sendCommand({
//         tabId: currentTab.id
//     }, "Network.enable", {}, function(response) {
//         chrome.debugger.onEvent.addListener(allEventHandler);
//     });
// });

// function allEventHandler(debuggerId, message, params) {
//     if (currentTab.id != debuggerId.tabId) {
//         return;
//     }

//     if (message == "Network.responseReceived") { //response return 
//         if (params.type === 'XHR') {
//             chrome.debugger.sendCommand({
//                 tabId: debuggerId.tabId
//             }, "Network.getResponseBody", {
//                 "requestId": params.requestId
//             }, gotTheResponse);
//         }
//     }

//     function gotTheResponse(response) {
//         console.log(params);
//         console.log(response);
//     }

// }