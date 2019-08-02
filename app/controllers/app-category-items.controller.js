(function () {
    'use strict';

    angular.module("appMain")
        .controller("AppCategoryItemsController", AppCategoryItemsController);

    AppCategoryItemsController.$inject = [
        "AppItemsService",
        "AppOrdersService",
        "CategoryItemsResolver",
        "OrderItemsResolver",
        "ngDialog",
        "$scope",
        "$routeParams",
        "$rootScope"
    ];

    function AppCategoryItemsController(
        AppItemsService, 
        AppOrdersService, 
        CategoryItemsResolver, 
        OrderItemsResolver, 
        ngDialog, 
        $scope, 
        $routeParams, 
        $rootScope) {

        var vm = $scope;
        var dialogRef = null;                        // Reference variable to the dialog instance
        vm.categoryId = $routeParams.category_id;    // Holds the current category id obtained from route parameter
        
        vm.addItemToCart = addItemToCart;            
        vm.categoryDetails = CategoryItemsResolver;  // Category items resolver obtained from router config 
        vm.orderItemsDetails = OrderItemsResolver;   // Order items resolver obtained from router config 

        /**
         * Opens the dialog for adding item to the cart
         * @param {integer} index 
         */
        function addItemToCart(index) {
            var item = vm.categoryDetails.items[index];
            var orderDetails = new OrderDetails(vm.orderItemsDetails.find((order) => order.item.itemId === item.itemId));
            
            // Actual method to open the dialog using ngDialog
            dialogRef = ngDialog.open({
                template: '/app/views/partial_views/app-add-to-cart-item-dialog-template.html',
                controller: 'AppAddToCartDialogController',
                closeByDocument: false,
                data: {
                    itemDetails: item,
                    currentSelectedTotal: orderDetails.totalQuantity
                },
                
            });

            // Listener that will trigger once the dialog has been closed. 
            // The promise will accept data from the controller that closes the this dialog.
            // The data will expect to received an instance of Order class
            dialogRef.closePromise.then((data) => {
                if (data.value) {
                    var newOrder = data.value;
                    if (newOrder.quantity > 0) {

                        AppOrdersService
                                .addNewOrder(newOrder)
                                .then((status) => {
                            
                            AppOrdersService
                                    .getOrderItems()
                                    .then(orderItems => {
                                        vm.orderItemsDetails = orderItems;
                                        emitOrderChanged();
                                    });
                        });
                    }
                }
            });
        }

        /**
         * Function that will broadcast orderchanged event.
         * Listeners are on AppHeaderController and AppCartCheckoutPanelController.
         */
        function emitOrderChanged() {
            $rootScope.$emit("orderchanged");
        }
    }

})();