var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Car = require('../models/car');

router.get('/', function(req, res, next) {
    Product.find(function(err, result) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < result.length; i += chunkSize) {
            productChunks.push(result.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Express', products: productChunks });
    });
});

router.get('/add-to-car/:id', function(req, res, next) {
    var productId = req.params.id;
    var car = new Car(req.session.car ? req.session.car : {});
    Product.findById(productId, function(err, result) { /// 从数据库中找到对应的product
        if (err) {
            return res.redirect('/');
        }
        car.add(result, productId); /// 添加到购物车
        req.session.car = car; /// 刷新session
        console.log(req.session.car);
        res.redirect('/');
    });
});

router.get('/shopping-car', function(req, res, next) {
    if (!req.session.car) {
        res.render('shop/shopping-car', { products: null });
    }
    var car = new Car(req.session.car);
    res.render('shop/shopping-car', { products: car.generateArray(), totalPrice: car.totalPrice });
});
module.exports = router;