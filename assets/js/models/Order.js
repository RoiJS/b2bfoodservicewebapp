function Order(object) {
    this.itemId = 0;
    this.categoryId = 0;
    this.quantity = 0;
    this.amount = 0;

    if (object) {
        $.extend(this, object);
    }
}

Order.prototype.parseOrders = (ordersObject) => {
    var orders = [];
    $.each(ordersObject, function(index, ordObj) {
        orders.push(new Order(ordObj));
    });
    return orders;
};