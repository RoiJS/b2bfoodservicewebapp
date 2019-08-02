(function () {
    'use strict';

    angular
        .module("appMain")
        .controller("AppCartCheckoutPanelController", AppCartCheckoutPanelController);

    AppCartCheckoutPanelController.$inject = ["AppOrdersService", "$scope", "$rootScope"];

    function AppCartCheckoutPanelController(AppOrdersService, $scope, $rootScope) {
        var vm = this;
        var voucherCode = "20OFFPROMO";

        vm.invalidVoucher = false;
        vm.notEligibleForVoucherDiscount = false;
        vm.activatedVoucher = false;
        vm.voucherActivationCounter = 0;
        vm.multipleVoucherActivation = false;

        vm.orderItems = [];
        vm.subtotalAmount = 0;
        vm.totalItemsCount = 0;
        vm.totalNetAmount = 0;
        vm.txtVoucherCode = "";

        vm.verifyVoucherCode = verifyVoucherCode;

        activate();

        /**
         * This will initialize the calculation of sub total and total pusrchased by the user.
         * This will also setup the event listener orderchanged
         */
        function activate() {
            initialize();
            listenForOrderChanges();
        }

        function initialize() {
            getOrderList(() => {
                calculateItemCount();
                calculateSubTotalAmount();
                calculateTotalAmount();
                applyVoucher();
            });
        }

        /**
         * Get order list details from server via AppOrdersService
         * @param {Function} callback 
         */
        function getOrderList(callback) {
            AppOrdersService
                .getOrderItems()
                .then((orderItems) => {
                    vm.orderItems = orderItems;
                    if (callback) callback();
                });
        }

        /**
         * Calculate the total amount purchased by the user
         */
        function calculateTotalAmount() {

            // Calculating total amount for any items 
            // that belong to Drink category
            var drinkItemsAmountCalculator = new CalculateCategoryItemsAmount(vm.orderItems, new CalculateDrinkCategoryAmount());   
            
            // Calculating total amount for any items that 
            // belong to Baking/Cooking Ingredients category
            var bakingCookingItemsAmountCalculator = new CalculateCategoryItemsAmount(vm.orderItems, new CalculateBakingCookingCategoryAmount());
            
            // Calculating total amount for all of the items that belong to all 
            // of the categories except for Drinks and Baking/Cooking Ingredients
            var someCategoryItemsAmountCalculator = new CalculateCategoryItemsAmount(vm.orderItems, new CalculateSomeCategoriesAmount());

            var drinkItemsAmountDetails = drinkItemsAmountCalculator.calculate();
            var bakingCookingAmountDetails = bakingCookingItemsAmountCalculator.calculate();
            var someCategoryItemsAmountDetails = someCategoryItemsAmountCalculator.calculate();

            // Calculate the net total amount through summation 
            // of the total amount obtained from items belongs to
            // drinks, baking/cooking ingredients and other categories
            vm.totalNetAmount = parseFloat((drinkItemsAmountDetails.totalNetAmount + bakingCookingAmountDetails.totalNetAmount + someCategoryItemsAmountDetails.totalNetAmount).toFixed(2));

            // Determine if the total purchased for baking cooking ingredients category 50 or more, 
            // then apply a 50 off discount on the net total amount 
            if (bakingCookingAmountDetails.totalNetAmount > 50) {
                vm.totalNetAmount = vm.totalNetAmount - 5;
            }
        }

        /**
         * Calculate the subtotal amount
         */
        function calculateSubTotalAmount() {
            var subtotalAmountDetails = new CalculateCategoryItemsAmount(vm.orderItems, new CalculateAllCategoriesAmount()).calculate();
            vm.subtotalAmount = subtotalAmountDetails.totalNetAmount;
        }

        /**
         * Calculate the total number of items selected by the user
         * */ 
        function calculateItemCount() {
            var itemCount = $.map(vm.orderItems, (order) => order.totalQuantity);
            vm.totalItemsCount = itemCount.reduce((a, b) => a + b, 0);
        }

        /**
         * This will verify voucher entered by the user to avail 20 off from the net total amount 
         */
        function verifyVoucherCode() {
            vm.activatedVoucher = false;
            
            // Match the entered voucher code with the correct voucher code
            if (vm.txtVoucherCode === voucherCode) { 

                // Determine if the voucher code has already activated/used
                if (vm.voucherActivationCounter === 0) {

                    // Determine if the total net amount is 100 or more, then apply 20 off
                    if (vm.totalNetAmount >= 100) {
                        vm.totalNetAmount = vm.totalNetAmount - 20; // Apply 20 off from the total amount
                        vm.notEligibleForVoucherDiscount = false;
                        vm.activatedVoucher = true;
                        vm.voucherActivationCounter = 1;
                        vm.multipleVoucherActivation = false;

                    } else {
                        vm.notEligibleForVoucherDiscount = true;
                        vm.txtVoucherCode = "";
                    }
                    vm.invalidVoucher = false;
                } else {
                    vm.multipleVoucherActivation = true;
                }
            } else {
                vm.txtVoucherCode = "";
                vm.invalidVoucher = true;
            }
        }

        /**
         * This will initialize voucher state if the current page is reloaded
         */
        function applyVoucher() {
            if (vm.txtVoucherCode === voucherCode) {
                if (vm.totalNetAmount >= 100) {
                    vm.totalNetAmount = vm.totalNetAmount - 20; // Apply 20 off to the total amount
                }
            }
        }

        /**
         * Event listener for orchanged event
         */
        function listenForOrderChanges() {
            var destroyHandler = $rootScope.$on("orderchanged", (event) => {
                initialize();
            });

            $scope.$on('$destroy', destroyHandler);
        }
    }

})()

