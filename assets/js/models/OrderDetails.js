function OrderDetails(object) {
    this.totalQuantity = 0;
    this.totalAmount = 0;
    this.category = null;
    this.item = null;

    Object.defineProperty(this, 'formatedTotalAmount', {
        get: function(){
            return this.totalAmount.toFixed(2);
        }
    });

    if (object) {
        $.extend(this, object);
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
        this.category = new Category(object.category);
        this.item = new Item(object.item);
    }
}

OrderDetails.prototype.parseOrderDetails = (orderDetailsObject) => {
    var orderDetails = [];
    $.each(orderDetailsObject, function(index, ordObj) {
        orderDetails.push(new OrderDetails(ordObj));
    });
    return orderDetails;
}