'use strict';

angular.module('myApp').controller('MainController', ['$scope', function($scope) {

    $scope.responses = [];
    $scope.clearResponses = clearResponses;

    function clearResponses() {
        $scope.responses.length = 0;
    }

    chrome.runtime.sendMessage({ directive: 'current-tab' }, function(response) {
        $scope.currentTabTitle = response.tab.title;
        $scope.currentTabID = response.tab.id;
        $scope.$apply();
    });
    
    chrome.runtime.onMessage.addListener(onMessageReceived);
    
    function onMessageReceived(request, sender, sendResponse) {
        switch (request.directive) {
            case 'network-request-response':
                manageNetworkRequestResponse(sendResponse, request);
                break;
            default:
                break;
        }
    }

    function manageNetworkRequestResponse(sendResponse, request) {
        console.log('adding request to the queue');
        $scope.responses.push({
            response: request.response,
            params: request.params
        });
        $scope.$apply();
        sendResponse({});
    }

}]);