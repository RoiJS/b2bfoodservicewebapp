(function () {
    'use strict';

    angular
        .module("appMain")
        .controller("AppCartItemListController", AppCartItemListController);

    AppCartItemListController.$inject = ["AppOrdersService", "ngDialog", "$rootScope"];

    function AppCartItemListController(AppOrdersService, ngDialog, $rootScope) {
        var vm = this;
        var dialogRef = null;

        vm.orderItems = [];
        vm.openUpdateQuantityDialog = openUpdateQuantityDialog;
        vm.removeItem = removeItem;

        activate();

        function activate() {
            getOrderItems();
        }

        /**
         * Retrieve order from the server
         */
        function getOrderItems() {
            AppOrdersService
                .getOrderItems()
                .then(orderItems => {
                    vm.orderItems = orderItems;
                });
        }

        /**
         * Opens the update quantity dialog
         * @param {integer} index 
         */
        function openUpdateQuantityDialog(index) {
            var orderDetails = new OrderDetails(vm.orderItems[index]);

            dialogRef = ngDialog.open({
                template: '/app/views/partial_views/app-update-item-quantity-dialog-template.html',
                controller: 'AppUpdateItemQuantityDialogController',
                closeByDocument: false,
                data: {
                    itemDetails: orderDetails.item,
                    currentSelectedTotal: orderDetails.totalQuantity
                }
            });

            // Promise listener for closing the dialog from the calling controller.
            // Data returned is an instance of Order class 
            dialogRef.closePromise.then((data) => {
                if (data.value) {
                    var newOrder = data.value;
                    AppOrdersService
                        .addNewOrder(newOrder)
                        .then((status) => {
                            getOrderItems();
                            emitOrderChanged();
                        });
                }
            });
        }

        /**
         * Removes item from the order list
         * @param {integer} index 
         */
        function removeItem(index) {

            if (confirm("Are you sure to remove selected item from the list?")) {
                var orderDetails = new OrderDetails(vm.orderItems[index]);
                AppOrdersService
                    .removeItem(orderDetails.item.itemId)
                    .then(() => {
                        getOrderItems();
                        emitOrderChanged();
                    })
            }
        }

        /**
         * Broadcast orderchanged event. 
         *  Listeners are on AppHeaderController and AppCartCheckoutPanelController.
         */
        function emitOrderChanged() {
            $rootScope.$emit("orderchanged");
        }
    }
})();
