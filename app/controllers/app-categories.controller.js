(function () {
    'use strict';
    
    angular.module("appMain")
        .controller("AppCategoriesController", AppCategoriesController);

    AppCategoriesController.$inject = ["AppItemsService"];

    function AppCategoriesController(AppItemsService) {
        var vm = this;
        vm.categories = [];

        activate();

        /**
         * Render the list of available categories
         */
        function activate() {
            AppItemsService
                .getAllCategoriesWithItems()
                .then((categories) => {
                    vm.categories = categories;
                });
        }
    }

})();

