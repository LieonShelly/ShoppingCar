var express = require('express');
var router = express.Router();
var Product = require('../models/product');

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

module.exports = router;