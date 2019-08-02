(function() {
    
        angular
            .module("appMain")
            .factory("AppOrdersService", AppOrdersService);
    
        AppOrdersService.$inject = ["$http"];
    
        function AppOrdersService($http) {
            
            return {
                addNewOrder: addNewOrder,
                getItemOrderedCount: getItemOrderedCount,
                getOrderItems: getOrderItems,
                removeItem: removeItem
            }
    
            function getItemOrderedCount() {
                return $http.get(`/api/order/get_item_ordered_counter`)
                .then((res) => {
                    return res.data.count;
                }).catch(showError);
            }
            
            function getOrderItems() {
                return $http.get(`/api/order/get_order_items`)
                .then((res) => {
                    return OrderDetails.prototype.parseOrderDetails(res.data);
                }).catch(showError);
            }

            function addNewOrder(orderDetails) {
                return $http.post(`/api/order/add_order`, orderDetails)
                    .then((res) => {
                        return res;
                    }).catch(showError);
            }
            
            function removeItem(itemId) {
                return $http.delete(`/api/order/remove_item/${itemId}`)
                    .then((res) => {
                        return res;
                    }).catch(showError);
            }

            function showError(e){
                console.error(e);
            }
        }
    
    })();