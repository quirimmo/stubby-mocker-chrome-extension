(function() {
    'use strict';

    angular.module('myApp').controller('RequestItemController', RequestItemController);

    RequestItemController.$inject = ['$mdDialog', 'networkRequestsService'];

    function RequestItemController($mdDialog, networkRequestsService) {
        var vm = this;

        vm.toggleDetailsButtonText;
        vm.toggleMocksDetailsButtonText;
        vm.toggleProxiesDetailsButtonText;

        vm.getMocksDetails = getMocksDetails;
        vm.getProxiesDetails = getProxiesDetails;
        vm.toggleDetails = toggleDetails;
        vm.toggleMocksDetails = toggleMocksDetails;
        vm.toggleProxiesDetails = toggleProxiesDetails;
        vm.getPrettifiedJSON = getPrettifiedJSON;
        vm.copyToClipboard = copyToClipboard;
        vm.removeRequest = removeRequest;

        init();

        // =====================================================================================================================

        function init() {
            vm.toggleDetailsButtonText = 'Open Details';
            vm.toggleMocksDetailsButtonText = 'Show Mocks Details';
            vm.toggleProxiesDetailsButtonText = 'Show Proxies Details';
        }

        function toggleDetails() {
            vm.item.showDetails = !vm.item.showDetails;
            vm.toggleDetailsButtonText = vm.item.showDetails ? 'Close Details' : 'Open Details';
        }

        function toggleMocksDetails() {
            vm.item.showMocksDetails = !vm.item.showMocksDetails;
            vm.toggleMocksDetailsButtonText = vm.item.showMocksDetails ? 'Hide Mocks Details' : 'Show Mocks Details';
        }

        function toggleProxiesDetails() {
            vm.item.showProxiesDetails = !vm.item.showProxiesDetails;
            vm.toggleProxiesDetailsButtonText = vm.item.showProxiesDetails ? 'Hide Proxies Details' : 'Show Proxies Details';
        }

        function getPrettifiedJSON(obj) {
            return JSON.stringify(obj, undefined, 2);
        }

        function removeRequest() {
            var confirm = $mdDialog.confirm()
                .title('Do you want to remove this request from the list?')
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm)
                .then(vm.onRemoveRequest.bind(null, vm.item))
                .catch();
        }

        function getMocksDetails() {
            return vm.getPrettifiedJSON(networkRequestsService.getStubbyMocksData(vm.item));
        }

        function getProxiesDetails() {
            return vm.getPrettifiedJSON(networkRequestsService.getStubbyProxiesData(vm.item));
        }

        function copyToClipboard(elementID) {
            let tempElement = document.createElement('textarea');
            tempElement.id = 'tempElement';
            tempElement.style.height = 0;
            document.body.appendChild(tempElement);
            tempElement.value = document.getElementById(`${elementID}-${vm.item.details.request.id}`).innerText;
            let selector = document.querySelector('#tempElement');
            selector.select();
            document.execCommand('copy');
            document.body.removeChild(tempElement);
        }

    }

})();