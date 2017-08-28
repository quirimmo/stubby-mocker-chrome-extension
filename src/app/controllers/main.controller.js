'use strict';

angular.module('myApp').controller('MainController', ['$scope', 'chromeService', 'networkRequestsService',
    function($scope, chromeService, networkRequestsService) {

        $scope.data = [];
        $scope.clearData = clearData;
        init();


        function init() {
            chromeService.sendMessage({ directive: 'current-tab' }, onMsgCurrentTabResponse);
            chromeService.addListener(onMessageReceived);
        }

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
                details: networkRequestsService.getRelevantRequestDetails(request)
            });
            $scope.$apply();
            sendResponse({});
        }

    }
]);