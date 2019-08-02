(function () {
    angular
        .module("appMain")
        .config(mainAppRouteConfig);

    mainAppRouteConfig.$inject = ['$routeProvider', '$locationProvider'];

    /**
     * App routing system configuration
     * @param {*} $routeProvider 
     * @param {*} $locationProvider 
     */
    function mainAppRouteConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                redirectTo: "/categories"
            })
            .when('/categories', {
                templateUrl: '/app/views/app-categories.html',
                controller: 'AppCategoriesController'
            })
            .when('/categories/:category_id/items', {
                templateUrl: '/app/views/app-category-items.html',
                controller: 'AppCategoryItemsController',
                resolve: {
                    CategoryItemsResolver: CategoryItemsResolver,
                    OrderItemsResolver: OrderItemsResolver
                }
            })
            .when('/shoppingcart', {
                templateUrl: '/app/views/app-shopping-cart.html'
            });

        $locationProvider.html5Mode(true);
    }


    CategoryItemsResolver.$inject = ["AppItemsService", "$route"];

    /**
     * Category items route resolver service definition
     * @param {*} AppItemsService 
     * @param {*} $route 
     */
    function CategoryItemsResolver(AppItemsService, $route) {
        return AppItemsService.getCategorById($route.current.params.category_id);
    }
    
    OrderItemsResolver.$inject = ["AppOrdersService"];

    /**
     * Order Items route resolver service definition
     * @param {*} AppOrdersService 
     */
    function OrderItemsResolver(AppOrdersService) {
        return AppOrdersService.getOrderItems();
    }
})();