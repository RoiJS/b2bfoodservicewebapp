function Category(object){
    this.categoryId = 0;
    this.name = "";
    this.icon = "";
    this.description = "";
    this.items = [];

    Object.defineProperty(this, 'ItemCount', {
        get: function(){
            return this.items.length;
        }
    });
    
    Object.defineProperty(this, 'TruncatedItems', {
        get: function(){
            return this.items.slice(0, 4);
        }
    });

    var _extendItems = function(itemsObject) {
        var items = [];
        if (itemsObject.length > 0) {
            $.each(itemsObject, function(index, object) {
                items.push(new Item(object));
            });
        }
        return items;
    };

    if (object) {
        $.extend(this, object);
        this.items = _extendItems(object.items);
    }
};

Category.prototype.parseCategories = (categoriesObject) => {
    var categories = [];
    $.each(categoriesObject, function(index, categoryObject) {
        categories.push(new Category(categoryObject));
    });
    return categories;
}