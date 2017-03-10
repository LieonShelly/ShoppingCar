var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    /// 验证传过来的参数(使用了express-validator库 即使验证输入的内容是否格式是否正确）
    req.checkBody('email', 'Invalid email').notEmpty().isEmail(); // 验证是否是一个邮箱格式
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 4 }); // 验证是否是一个长度为4的密码， 如果不是则输出信息Invalid password 
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(err) {
            messages.push(err.msg);
        });
        console.log('输入错误');
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            console.log('查询错误');
            return done(err);
        }
        if (user) {
            console.log('Email is already in use');
            return done(null, false, req.flash('error', 'Email is already in use'));
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                console.log('存储错误');
                done(err);
            }
            console.log('成功存储');
            return done(null, newUser);
        });
    });

}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(err) {
            messages.push(err.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) { /// 查询出错
            return done(err);
        }
        if (!user) { /// 用户不存在
            return done(null, false, req.flash('error', 'Email is not exist'));
        }
        if (!user.validate(passport)) { /// 密码不正确
            return done(null, false, req.flash('error', 'wrong password'));
        }
        return done(null, user);
    });

}));
module.exports = passport;