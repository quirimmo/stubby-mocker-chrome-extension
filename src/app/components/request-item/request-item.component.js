(function() {
    'use strict';

    angular.module('myApp').component('requestItem', {
        templateUrl: 'app/components/request-item/request-item.html',
        controller: 'RequestItemController',
        controllerAs: 'vm',
        bindings: {
            item: '=',
            onRemoveRequest: '&'
        }
    });

})();