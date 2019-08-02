(function () {
    'use strict';

    angular
        .module("appMain")
        .controller("AppHeaderController", AppHeaderController);

    AppHeaderController.$inject = ["AppOrdersService", "$scope", "$rootScope"];

    function AppHeaderController(AppOrdersService, $scope, $rootScope) {
        var vm = this;
        vm.ItemOrderedCounter = 0;

        activate();

        function activate() {
            getOrderItemsCount();
            listenForOrderChanges();
        }

        /**
         * Get current order items count
         */
        function getOrderItemsCount() {
            AppOrdersService
                .getItemOrderedCount()
                .then(count => {
                    vm.ItemOrderedCounter = count;
                });
        }

        /**
         * Event listener for orchanged event
         */
        function listenForOrderChanges() {
            var destroyHandler = $rootScope.$on("orderchanged", (event) => {
                getOrderItemsCount();
            });

            $scope.$on('$destroy', destroyHandler);
        }
    }

})();