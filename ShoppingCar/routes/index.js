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
    Product.findById(productId, function(err, result) {
        if (err) {
            return res.redirect('/');
        }
        car.add(result, productId);
        req.session.car = car;
        console.log(req.session.car);
        res.redirect('/');
    });
});
module.exports = router;