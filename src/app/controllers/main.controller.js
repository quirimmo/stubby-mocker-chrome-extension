'use strict';

angular.module('myApp')
    .controller('MainController', ['$scope', 'chromeService', 'networkRequestsService', '$timeout',
        MainController
    ]);

function MainController($scope, chromeService, networkRequestsService, $timeout) {

    $scope.data;
    $scope.showLoading;

    $scope.clearData = clearData;
    $scope.removeRequestItem = removeRequestItem;

    let timeout;
    init();


    function init() {
        $scope.data = [];
        $scope.showLoading = false;
        timeout = null;
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
            case 'start-sniffing-network':
                manageSniffingNetwork(sendResponse);
                break;
            default:
                break;
        }
    }

    function manageSniffingNetwork(sendResponse) {
        sendResponse({});
        if ($timeout != null) {
            $timeout.cancel(timeout);
        }
        $scope.showLoading = true;
        timeout = $timeout(() => {
            $scope.showLoading = false;
        }, 3000);
        $scope.$apply();
    }

    function manageNetworkRequestResponse(sendResponse, request) {
        $scope.data.push({
            details: networkRequestsService.getRelevantRequestDetails(request)
        });
        sendResponse({});
        $scope.showLoading = false;
        $scope.$apply();
    }

    

}