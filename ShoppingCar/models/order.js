var mongoose = require('mongoose');
var Schma = mongoose.Schema;
var schema = new Schma({
    user: { type: Schma.Types.ObjectId, ref: 'User' },
    car: { type: Object, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    paymentId: { type: String, required: true },
});

module.exports = mongoose.model('Order', schema);