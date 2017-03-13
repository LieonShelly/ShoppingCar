var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var Order = require('../models/order');
var Car = require('../models/car');

router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res) {
    Order.find({ user: req.user }, function(err, result) {
        if (err) {
            return res.write('Error');
        }
        var car;
        result.forEach(function(order) {
            car = new Car(order.car);
            order.items = car.generateArray();
        });
        res.render('users/profile', { orders: result });
    });
});

/// 注销
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/'); // redirect方法与的路径与所在文件位置无关,相当于 请求 http:localhost
});
/**
 * 中间件: 其作用是监视某个功能，程序一直在被执行
 */
/// 使用use（中间件） 相当于 程序 一直在被执行，起个监视作用
/// 一直要监视所有是否被访问，如果被访问且没有登录，则执行next()(即执行下一步，不作出任何响应)
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

/* GET users listing. */
passport.initialize();
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
    /// render是渲染一个页面， 要进行传值 
    var messages = req.flash('error');
    res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 }); // 相当于渲染users文件下的sign页面
});

router.get('/signin', function(req, res, next) {
    /// render是渲染一个页面， 要进行传值 
    var messages = req.flash('error');
    res.render('users/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 }); // 相当于渲染users文件下的sign页面
});

/// 注册 (在user.js文件中) <==> http:localhost/user/sign
router.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/user/signup', // 相当于发起get请求 http:localhost/user/signup
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect('/user/profile');
    }
});

/// 登录(在user.js文件中) <==> http:localhost/user/signin
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        res.redirect(req.session.oldUrl);
        req.session.oldUrl = null;
    } else {
        res.redirect('/user/profile');
    }
});


function isLoggedIn(req, res, next) {
    console.log("登录后的" + req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    console.log("没有登录" + req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;