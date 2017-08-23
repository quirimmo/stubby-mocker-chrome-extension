'use strict';

angular.module('myApp').controller('MainController', ['$scope', function($scope) {

    chrome.runtime.sendMessage({ directive: 'current-tab' }, function(response) {
        $scope.currentTabTitle = response.tab.title;
        $scope.currentTabID = response.tab.id;
        $scope.$apply();
    });

    $scope.test = 'Quirino Test';

}]);