(function () {
    'use strict';

    angular.module("appMain")
        .controller("AppAddToCartDialogController", AppAddToCartDialogController);

    AppAddToCartDialogController.$inject = ["$scope"];

    function AppAddToCartDialogController($scope) {
        var vm = $scope;
        vm.itemDetails = null;          // Details of the selected item that is to be added to cart
        vm.currentSelectedTotal = 0;    // This represents the quantity of the selected items that is already exists on the cart 
        vm.selectedQuantity = 0;        // Scope variable used on <input ng-model="selectedQuantity"> on this controllers' view template (app-add-to-cart-item-dialog-template.html).
                                        // This will hold the new quantity for the selected item entered by the user. 
        
        vm.invalidQuantity = false;     // Variable that will determine if the current quantity entered by the user is invalid or not

        vm.closeDialog = closeDialog;   
        vm.addQuantity = addQuantity;
        vm.subtractQuantity = subtractQuantity;

        activate();

        /**
         * Initializer method that will immediately trigger once the controller has been loaded.
         * Inside this function, it will store the data passed from ngDialog from the calling controller
         * to the variables on this controller.
         */
        function activate() {
            vm.itemDetails = new Item(vm.ngDialogData.itemDetails);
            vm.currentSelectedTotal = vm.ngDialogData.currentSelectedTotal;
        }

        /**
         * Add quantity for the selected item that the user wants to add to his/her shopping cart
         */
        function addQuantity() {
            if ((vm.selectedQuantity + vm.currentSelectedTotal) <= vm.itemDetails.quantity) {
                vm.selectedQuantity = vm.selectedQuantity + 1;
                vm.invalidQuantity = false;
            } else {
                vm.invalidQuantity = true;
            }
        }

        /**
         * Subtract quantity for the selected item that the user wants to add to his/her shopping cart
         */
        function subtractQuantity() {
            if (vm.selectedQuantity !== 0) {
                vm.selectedQuantity = vm.selectedQuantity - 1;
                vm.invalidQuantity = false;
            }
        }

        /**
         * Function for closing the dialog
         * @param {boolean} isConfirm 
         */
        function closeDialog(isConfirm) {
            // If isConfirm is set to true, the dialog will close with 
            // returning data with an instance of Order class
            if (isConfirm) {

                alert(`${vm.selectedQuantity} quantities for this item has been added your cart.`);

                vm.closeThisDialog(new Order({
                    categoryId: vm.itemDetails.categoryId,
                    itemId: vm.itemDetails.itemId,
                    quantity: vm.selectedQuantity,
                    amount: (vm.selectedQuantity * vm.itemDetails.current_price)
                }));
            } else {
                vm.closeThisDialog();
            }
        }
    }
})();