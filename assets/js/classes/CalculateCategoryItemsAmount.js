function CalculateCategoryItemsAmount(orderItems, categoryClass) {

    this.calculate = () => {
        var netAmountDetails = null

        var categoryItems = $.map(orderItems, (order) => {
            if (categoryClass.CategoryTypes) {
                if ($.inArray(order.category.categoryId, categoryClass.CategoryTypes) >= 0) {
                    return order;
                }
            }
        });

        var count = $.map(categoryItems, (item) => item.totalQuantity).reduce((a, b) => a + b, 0);
        var amountWithoutDiscount = $.map(categoryItems, (item) => item.totalAmount).reduce((a, b) => a + b, 0);

        if (categoryClass.calculateAndApplyDiscount) {
            netAmountDetails = categoryClass.calculateAndApplyDiscount(count, amountWithoutDiscount);
        }

        return netAmountDetails;
    }
}