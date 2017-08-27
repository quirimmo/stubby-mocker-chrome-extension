'use strict';

angular.module('myApp').controller('MainController', ['$scope', 'chromeService', function($scope, chromeService) {

    $scope.responses = [];
    $scope.clearResponses = clearResponses;

    chromeService.sendMessage({ directive: 'current-tab' }, onMsgCurrentTabResponse);
    chromeService.addListener(onMessageReceived);


    $scope.accordianData = [{
            "heading": "HOLDEN",
            "content": "GM Holden Ltd, commonly known as Holden, is an Australian automaker that operates in Australasia and is headquartered in Port Melbourne, Victoria. The company was founded in 1856 as a saddlery manufacturer in South Australia."
        },
        {
            "heading": "FORD",
            "content": "The Ford Motor Company (commonly referred to as simply Ford) is an American multinational automaker headquartered in Dearborn, Michigan, a suburb of Detroit. It was founded by Henry Ford and incorporated on June 16, 1903."
        },
        {
            "heading": "TOYOTA",
            "content": "Toyota Motor Corporation is a Japanese automotive manufacturer which was founded by Kiichiro Toyoda in 1937 as a spinoff from his father's company Toyota Industries, which is currently headquartered in Toyota, Aichi Prefecture, Japan."
        }
    ];


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