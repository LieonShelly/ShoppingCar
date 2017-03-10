var mongoose = require('mongoose');
var Schma = mongoose.Schema;
var schema = new Schma ({
    imagePath: String,
    title: String,
    description: String,
    price: Number
});

module.exports = mongoose.model('Product', schema);
