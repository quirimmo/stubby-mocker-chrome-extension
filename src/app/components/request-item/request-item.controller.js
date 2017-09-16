(function() {
    'use strict';

    angular.module('myApp').controller('RequestItemController', RequestItemController);

    RequestItemController.$inject = ['$mdDialog'];

    function RequestItemController($mdDialog) {
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
            var confirm = $mdDialog.confirm()
                .title('Do you want to remove this request from the list?')
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm)
                .then(vm.onRemoveRequest.bind(null, vm.item))
                .catch();
        }

        // ======================================
        // STUBBY STUFF
        // ======================================
        // {
        //     "request": {
        //         "url": "/services/reference-data/SalesProducts/$",
        //         "method": "GET"
        //     },
        //     "response": {
        //         "status": 200,
        //         "headers": {
        //             "Content-Type": "application/json",
        //             "Access-Control-Allow-Origin": "*"
        //         },
        //         "body": {
        //             "error": {
        //                 "errorCode": "0",
        //                 "errorString": "",
        //                 "fieldErrors": []
        //             },
        //             "referenceDataList": [
        //                 {
        //                     "name": "SalesProducts",
        //                     "labels": [
        //                         "Current Account",
        //                         "Regular Savings",
        //                         "Deposit Savings",
        //                         "Credit Card - Personal",
        //                         "Credit Card - Business",
        //                         "Loan - Personal",
        //                         "Car Finance",
        //                         "Loan - Business",
        //                         "Mortgage",
        //                         "Home Insurance",
        //                         "Car Insurance",
        //                         "Travel Insurance",
        //                         "Investment",
        //                         "Protection",
        //                         "Pensions"
        //                     ]
        //                 }
        //             ]
        //         }
        //     }
        // },


        // '/services/[0-9]+/send-registration-email-template/$':                            '/services/send-registration-email-template',

    }

})();