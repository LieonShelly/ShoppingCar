var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Car = require('../models/car');
var stripe = require('strip')(
    "sk_test_aErgAx3LUTZ8NIVHobq95nB8"
);
var Order = require('../models/order');

router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, result) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < result.length; i += chunkSize) {
            productChunks.push(result.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Express', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
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

router.get('/checkout', function(req, res, next) {
    if (!req.session.car) {
        res.redirect('/shopping-car');
    }
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { total: req.session.car.totalPrice, errMsg: errMsg, noErrors: !errMsg });
});

router.post('/checkout', function(req, res, next) {
    if (!req.session.car) {
        res.redirect('/shopping-car');
    }
    var car = new Car(req.session.car);
    stripe.charges.create({
        amount: car.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        console.log("支付完成的回调" + charge);
        var order = new Order({
            user: req.user,
            car: car,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product');
            req.session.car = null;
            res.redirect('/');
        });

    });
});
module.exports = router;