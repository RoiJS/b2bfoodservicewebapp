(function() {

    angular
        .module("appMain")
        .factory("AppItemsService", AppItemsService);

    AppItemsService.$inject = ["$http"];

    function AppItemsService($http) {
        
        return {
            getAllCategoriesWithItems: getAllCategoriesWithItems,
            getCategorById: getCategorById
        }

        function getAllCategoriesWithItems() {
            return $http.get(`/api/items/get_categories_with_items`)
                .then((res) => {
                    return Category.prototype.parseCategories(res.data);
                }).catch(showError);
        }
        
        function getCategorById(categoryId) {
            return $http.get(`/api/items/get_category_by_id/${categoryId}`)
                .then((res) => {
                    return new Category(res.data);
                }).catch(showError);
        }

        function showError(e){
            console.error(e);
        }
    }

})();