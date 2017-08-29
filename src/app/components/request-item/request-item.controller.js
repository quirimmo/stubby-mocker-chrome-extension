(function() {
    'use strict';

    angular.module('myApp').controller('RequestItemController', RequestItemController);

    RequestItemController.$inject = [];

    function RequestItemController() {
        var vm = this;

        vm.toggleDetailsButtonText = 'Open Details';

        vm.toggleDetails = toggleDetails;
        vm.getPrettifiedJSON = getPrettifiedJSON;
        vm.removeRequest = removeRequest;

        init();

        ////////////////

        function init() {

        }

        function toggleDetails() {
            vm.item.showDetails = !vm.item.showDetails;
            vm.toggleDetailsButtonText = vm.item.showDetails ? 'Close Details' : 'Open Details';
        }

        function getPrettifiedJSON(obj) {
            return JSON.stringify(obj, undefined, 2);
        }

        function removeRequest() {
            vm.onRemoveRequest(vm.item);
        }

    }

})();