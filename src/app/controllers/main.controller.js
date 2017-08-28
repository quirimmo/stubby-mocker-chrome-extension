'use strict';

angular.module('myApp').controller('MainController', ['$scope', 'chromeService', function($scope, chromeService) {

    $scope.data = [];
    $scope.clearData = clearData;

    chromeService.sendMessage({ directive: 'current-tab' }, onMsgCurrentTabResponse);
    chromeService.addListener(onMessageReceived);


    function onMsgCurrentTabResponse(response) {
        $scope.currentTabTitle = response.tab.title;
        $scope.currentTabID = response.tab.id;
        $scope.$apply();
    }


    function clearData() {
        $scope.data.length = 0;
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
        $scope.data.push({
            details: getRelevantRequestDetails(request)
        });
        $scope.$apply();
        sendResponse({});
    }

    function getRelevantRequestDetails(request) {
        return {
            request: {
                id: request.params.requestId,
                url: request.params.response.url,
                timestamp: request.params.response.timestamp,
                type: request.params.response.type,
                mimeType: request.params.response.mimeType,
                remoteIPAddress: request.params.response.remoteIPAddress,
                remotePort: request.params.response.remotePort,
                headers: request.params.response.requestHeaders
            },
            response: {
                status: request.params.response.status,
                statusText: request.params.response.statusText,
                body: request.response.body,
                headers: request.params.response.headers
            }
        };
    }

}]);