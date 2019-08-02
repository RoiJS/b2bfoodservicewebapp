var express = require("express");
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/app', express.static(__dirname + '/app/'));
app.use('/bootstrap-css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap-js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/ng-dialog', express.static(__dirname + '/node_modules/ng-dialog'));
app.use('/assets', express.static(__dirname + '/assets'));

var port = process.env.PORT || 9152;

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

/***************************************** */
/* 
/*    REST API ENDPOINTS
/* 
/*******************************************/

app.route('/api/items/get_categories_with_items')
    .get((req, res) => {
        var categoriesObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceitems.json');
        categoriesObject = JSON.parse(categoriesObject);
        res.json(categoriesObject.categories);
    });

app.route('/api/items/get_category_by_id/:category_id')
    .get((req, res) => {
        var category_id = parseInt(req.params["category_id"]);
        var categoriesObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceitems.json');
        categoriesObject = JSON.parse(categoriesObject);

        var categoryIndex = categoriesObject.categories.findIndex((cat) => {
            return cat.categoryId === category_id;
        });

        res.json(categoriesObject.categories[categoryIndex]);
    });

app.route('/api/order/add_order')
    .post((req, res) => {
        var newOrder = req.body;
        var orderListObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json');
        orderListObject = JSON.parse(orderListObject);
        orderListObject.orders.push(newOrder);
        fs.writeFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json', JSON.stringify(orderListObject));
        res.status(200).end();
    });

app.route('/api/order/get_item_ordered_counter')
    .get((req, res) => {
        var itemCount = 0;
        var orderListObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json');
        orderListObject = JSON.parse(orderListObject);

        var orderedItems = Array.from(new Set(orderListObject.orders.map(o => o.itemId)))
            .map(itemId => {
                // Get individual quantity
                var itemOrderTotalQuantity = orderListObject.orders
                    .map((order) => {
                        if (order.itemId === itemId) return order.quantity;
                    })
                    .filter(o => o)
                    .reduce((a, b) => a + b, 0);

                if (itemOrderTotalQuantity > 0) {
                    return {
                        itemId: itemId,
                        categoryId: orderListObject.orders.find(o => o.itemId === itemId).categoryId,
                        totalQuantity: itemOrderTotalQuantity
                    }
                }
            });

        itemCount = orderedItems.filter(o => o)
            .map(i => i.totalQuantity)
            .reduce((a, b) => a + b, 0);

        res.send({
            count: itemCount
        });
    });

app.route('/api/order/get_order_items')
    .get((req, res) => {

        var categoriesObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceitems.json');
        var orderListObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json');

        orderListObject = JSON.parse(orderListObject);
        categoriesObject = JSON.parse(categoriesObject);

        var orderedItems = Array.from(new Set(orderListObject.orders.map(o => o.itemId)))
            .map(itemId => {

                // Get total quantity
                var itemOrderTotalQuantity = orderListObject.orders
                    .map((order) => {
                        if (order.itemId === itemId) return order.quantity;
                    })
                    .filter(o => o)
                    .reduce((a, b) => a + b, 0);

                // Get total amount
                var itemOrderTotalAmount = orderListObject.orders
                    .map((order) => {
                        if (order.itemId === itemId) return order.amount;
                    })
                    .filter(o => o)
                    .reduce((a, b) => a + b, 0);

                if (itemOrderTotalQuantity > 0) {

                    var categoryId = orderListObject.orders.find(o => o.itemId === itemId).categoryId;
                    var categoryIndex = categoriesObject.categories.findIndex((category) => {
                        return category.categoryId === categoryId;
                    });
                    var categoryDetails = categoriesObject.categories[categoryIndex];

                    var itemIndex = categoryDetails.items.findIndex((item) => {
                        return item.itemId === itemId;
                    });
                    var itemDetails = categoryDetails.items[itemIndex];

                    return {
                        category: categoryDetails,
                        item: itemDetails,
                        totalQuantity: itemOrderTotalQuantity,
                        totalAmount: itemOrderTotalAmount
                    }
                }

            }).filter(o => o);

        res.json(orderedItems);
    });

app.route('/api/order/remove_item/:item_id')
    .delete((req, res) => {
        var itemId = parseInt(req.params["item_id"]);
        var orderListObject = fs.readFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json');
        orderListObject = JSON.parse(orderListObject);
        var indices = orderListObject.orders.map((e, i) => e.itemId === itemId ? i : '').filter(String)

        indices.forEach((i) => orderListObject.orders[i] = null);
        orderListObject.orders = orderListObject.orders.filter(order => order);

        fs.writeFileSync('assets/mock-storage-data/b2bfoodserviceorderlist.json', JSON.stringify(orderListObject));
        res.status(200).end();
    });


app.all('/*', function (req, res, next) {
    res.sendFile(__dirname + '/app/index.html');
});

app.listen(port, function () {
    console.log(`B2BFoodService Server is Listening on port ${port}`);
});