'use strict';

angular.module('myApp').controller('MainController', ['$scope', 'chromeService', function($scope, chromeService) {

    $scope.responses = [];
    $scope.clearResponses = clearResponses;

    chromeService.sendMessage({ directive: 'current-tab' }, onMsgCurrentTabResponse);
    chromeService.addListener(onMessageReceived);



    function onMsgCurrentTabResponse(response) {
        $scope.currentTabTitle = response.tab.title;
        $scope.currentTabID = response.tab.id;
        $scope.$apply();
    }

    
    function clearResponses() {
        $scope.responses.length = 0;
    }

    
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
        $scope.responses.push({
            response: request.response,
            params: request.params
        });
        $scope.$apply();
        sendResponse({});
    }

}]);