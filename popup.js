'use strict';


// chrome.runtime.sendMessage({directive: 'clicked-extension-button'}, function(response) {});

var currentTab;
const version = "1.0";
const queryInfo = {
    active: true,
    currentWindow: true
};
var _this = this;
chrome.tabs.query(queryInfo, function(tabs) {
    currentTab = tabs[0];
    // alert(currentTab);
    chrome.runtime.sendMessage({directive: 'clicked-extension-button', tab: currentTab}, function(response) {});
    _this.close();
    // alert('A');
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
});

function allEventHandler(debuggerId, message, params) {
    if (currentTab.id != debuggerId.tabId) {
        return;
    }

    if (message == "Network.responseReceived") { //response return 
        if (params.type === 'XHR') {
            chrome.debugger.sendCommand({
                tabId: debuggerId.tabId
            }, "Network.getResponseBody", {
                "requestId": params.requestId
            }, gotTheResponse);
        }
    }

    function gotTheResponse(response) {
        chrome.runtime.sendMessage({directive: 'test', content: response}, function(resp) {});
        console.log(params);
        console.log(response);
    }

}



// function clickHandler(e) {
//     chrome.runtime.sendMessage({directive: "open"}, function(response) {
//         this.close(); // close the popup when the background finishes processing request
//     });
// }

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('click-me').addEventListener('click', clickHandler);
// })

// "default_popup": "popup.html",
// "default_title": "Click here!"
// let windowReference;
// if (windowReference) {
//     chrome.windows.update(windowReference.id, {
//         focused: true
//     });
// }
// else {
//     chrome.windows.create({ 'url': 'background.html', 'type': 'popup' }, function(window) {
//         windowReference = window;
//         chrome.windows.update(windowReference.id, {
//             focused: true
//         });
//     });
// }


// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.windows.create({
//         url: chrome.runtime.getURL("main.html"),
//         type: "popup"
//     }, function(win) {
//         win.focus();
//     });
// });

// chrome.windows.create({
//     url: chrome.runtime.getURL("main.html"),
//     type: "popup"
// }, function(win) {
//     win.focus();
// });

// var currentTab;
// const version = "1.0";
// var queryInfo = {
//     active: true,
//     currentWindow: true
// };
// chrome.tabs.query(queryInfo, function(tabs) {
//     currentTab = tabs[0];
//     chrome.debugger.detach({ tabId: currentTab.id });
//     chrome.debugger.attach({
//         tabId: currentTab.id
//     }, version, function() {
//         if (chrome.runtime.lastError) {
//             console.log(chrome.runtime.lastError.message);
//             return;
//         }
//         // 2. Debugger attached, now prepare for modifying the UA
//         chrome.debugger.sendCommand({
//             tabId: currentTab.id
//         }, "Network.enable", {}, function(response) {
//             console.log(response);
//             chrome.debugger.onEvent.addListener(allEventHandler);
//             // Possible response: response.id / response.error
//             // 3. Change the User Agent string!
//             // chrome.debugger.sendCommand({
//             //     tabId: currentTab.id
//             // }, "Network.setUserAgentOverride", {
//             //     userAgent: 'Whatever you want'
//             // }, function(response) {
//             //     // Possible response: response.id / response.error
//             //     // 4. Now detach the debugger (this restores the UA string).
//             //     chrome.debugger.detach({ tabId: tabId });
//             // });
//         });
//     });
//     // chrome.debugger.attach({ //debug at current tab
//     //     tabId: currentTab.id
//     // }, version, onAttach.bind(null, currentTab.id));
// });

// // function onAttach(tabId) {
// //     chrome.debugger.sendCommand({ //first enable the Network
// //         tabId: tabId
// //     // }, "Network.enable");
// //     chrome.debugger.onEvent.addListener(allEventHandler);
// // }



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
//         // chrome.debugger.sendCommand({
//         //     tabId: debuggerId.tabId
//         // }, "Network.getResponseBody", {
//         //     "requestId": params.requestId
//         // }, function(response) {
//         //     console.log(response);
//         //     // you get the response body here!
//         //     // you can close the debugger tips by:
//         //     // chrome.debugger.detach(debuggerId);
//         // });
//     }

//     function gotTheResponse(response) {
//         console.log(params);
//         console.log(response);
//     }

// }






// // /**
// //  * Get the current URL.
// //  *
// //  * @param {function(string)} callback - called when the URL of the current tab
// //  *   is found.
// //  */
// // function getCurrentTabUrl(callback) {
// //     // Query filter to be passed to chrome.tabs.query - see
// //     // https://developer.chrome.com/extensions/tabs#method-query
// //     var queryInfo = {
// //         active: true,
// //         currentWindow: true
// //     };

// //     chrome.tabs.query(queryInfo, function(tabs) {
// //         // chrome.tabs.query invokes the callback with a list of tabs that match the
// //         // query. When the popup is opened, there is certainly a window and at least
// //         // one tab, so we can safely assume that |tabs| is a non-empty array.
// //         // A window can only have one active tab at a time, so the array consists of
// //         // exactly one tab.
// //         var tab = tabs[0];

// //         // A tab is a plain object that provides information about the tab.
// //         // See https://developer.chrome.com/extensions/tabs#type-Tab
// //         var url = tab.url;

// //         // tab.url is only available if the "activeTab" permission is declared.
// //         // If you want to see the URL of other tabs (e.g. after removing active:true
// //         // from |queryInfo|), then the "tabs" permission is required to see their
// //         // "url" properties.
// //         console.assert(typeof url == 'string', 'tab.url should be a string');
// //         // console.log(url);
// //         chrome.debugger.attach({ //debug at current tab
// //             tabId: currentTab.id
// //         }, version, onAttach.bind(null, currentTab.id));
// //         callback(url);
// //     });
// // }

// // /**
// //  * @param {string} searchTerm - Search term for Google Image search.
// //  * @param {function(string,number,number)} callback - Called when an image has
// //  *   been found. The callback gets the URL, width and height of the image.
// //  * @param {function(string)} errorCallback - Called when the image is not found.
// //  *   The callback gets a string that describes the failure reason.
// //  */
// // function getImageUrl(searchTerm, callback, errorCallback) {
// //     // Google image search - 100 searches per day.
// //     // https://developers.google.com/image-search/
// //     var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
// //         '?v=1.0&q=' + encodeURIComponent(searchTerm);
// //     var x = new XMLHttpRequest();
// //     x.open('GET', searchUrl);
// //     // The Google image search API responds with JSON, so let Chrome parse it.
// //     x.responseType = 'json';
// //     x.onload = function() {
// //         // Parse and process the response from Google Image Search.
// //         var response = x.response;
// //         if (!response || !response.responseData || !response.responseData.results ||
// //             response.responseData.results.length === 0) {
// //             errorCallback('No response from Google Image search!');
// //             return;
// //         }
// //         var firstResult = response.responseData.results[0];
// //         // Take the thumbnail instead of the full image to get an approximately
// //         // consistent image size.
// //         var imageUrl = firstResult.tbUrl;
// //         var width = parseInt(firstResult.tbWidth);
// //         var height = parseInt(firstResult.tbHeight);
// //         console.assert(
// //             typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
// //             'Unexpected respose from the Google Image Search API!');
// //         callback(imageUrl, width, height);
// //     };
// //     x.onerror = function() {
// //         errorCallback('Network error.');
// //     };
// //     x.send();
// // }

// // function renderStatus(statusText) {
// //     document.getElementById('status').textContent = statusText;
// // }

// // document.addEventListener('DOMContentLoaded', function() {
// //     getCurrentTabUrl(function(url) {
// //         // Put the image URL in Google search.
// //         renderStatus('Performing Google Image search for ' + url);

// //         getImageUrl(url, function(imageUrl, width, height) {

// //             renderStatus('Search term: ' + url + '\n' +
// //                 'Google image search result: ' + imageUrl);
// //             var imageResult = document.getElementById('image-result');
// //             // Explicitly set the width/height to minimize the number of reflows. For
// //             // a single image, this does not matter, but if you're going to embed
// //             // multiple external images in your page, then the absence of width/height
// //             // attributes causes the popup to resize multiple times.
// //             imageResult.width = width;
// //             imageResult.height = height;
// //             imageResult.src = imageUrl;
// //             imageResult.hidden = false;

// //         }, function(errorMessage) {
// //             renderStatus('Cannot display image. ' + errorMessage);
// //         });
// //     });
// // });

// // document.addEventListener('DOMContentLoaded', function() {
// //     // console.log('DOM content loaded');
// //     chrome.webRequest.onCompleted.addListener(
// //         function(details) {
// //             console.log(details);
// //             // return { cancel: details.url.indexOf("://www.evil.com/") != -1 };
// //         }, { urls: ["<all_urls>"] });
// // });