'use strict';

angular.module('myApp').service('chromeService', [function() {

    this.sendMessage = sendMessage;
    this.addListener = addListener;

    return this;

    function sendMessage(params, callback) {
        chrome.runtime.sendMessage(params, callback);
    }

    function addListener(callback) {
        chrome.runtime.onMessage.addListener(callback);
    }

}]);