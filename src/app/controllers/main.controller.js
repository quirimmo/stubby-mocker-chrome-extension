'use strict';

angular.module('myApp').controller('MainController', ['$scope', 'chromeService', 'networkRequestsService',
    function($scope, chromeService, networkRequestsService) {

        $scope.data = [];
        $scope.clearData = clearData;
        $scope.removeRequestItem = removeRequestItem;
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

        function removeRequestItem(item) {
            let ind = $scope.data.findIndex(el => el.details.request.id === item.details.request.id);
            if (ind > -1) {
                $scope.data.splice(ind, 1);
                $scope.$apply();
            }
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