var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/// 加密
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: String,
    password: String
});
/// 注意是 methods 不是 method
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);