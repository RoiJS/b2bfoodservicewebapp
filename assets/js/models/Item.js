function Item(object) {
    this.itemId = 0;
    this.categoryId = 0;
    this.name = "";
    this.dimension = "";
    this.description = "";
    this.image_path = "";
    this.quantity = 0;
    this.old_price = 0;
    this.current_price = 0;
    
    Object.defineProperty(this, 'isSoldout', {
        get: function(){
            return this.availableStocks === 0;
        }
    });
    
    Object.defineProperty(this, 'hasNewPrice', {
        get: function(){
            return this.old_price !== this.current_price;
        }
    });

    Object.defineProperty(this, 'formatedOldPrice', {
        get: function(){
            return this.old_price.toFixed(2);
        }
    });
    
    Object.defineProperty(this, 'formatedCurrentPrice', {
        get: function(){
            return this.current_price.toFixed(2);
        }
    });
    
    Object.defineProperty(this, 'imagePath', {
        get: function(){
            return `/assets/images/categories/${this.image_path}`;
        }
    });

    if (object) {
        $.extend(this, object);
    }
};