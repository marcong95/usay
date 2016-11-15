var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user', {
        title: 'User',
        index: 'user',
        toBack: true,
        toSearch: true,
        user: req.session.user
    });
});

router.get('/login', function(req, res, next) {
    res.render('user/login', {
        title: 'Login',
        index: 'login',
        user: req.session.user
    });
});

router.post('/login', function(req, res, next) {       
    //检验用户输入
    if(req.body.username == undefined || req.body.username == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.username.legnth > 15){
        res.send({
            done: false,
            msg: "账号长度不能大于15"
        });
        return;
    }
    if(req.body.password == undefined || req.body.password == ''){
        res.send({
            done: false,
            msg: "密码不能为空"
        });
        return;
    }else if(req.body.password.length <6 || req.body.password.legnth > 20){
        res.send({
            done: false,
            msg: "请确保密码长度为6-20"
        });
        return;
    } 
    //生成口令的数列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    //获取待处理数据
    var newUser = {
        name: req.body.username,
        password: password
    };
    
    //检查用户名是否已存在
    User.findByName(newUser.name, function(err, user) {
        if(!user)
            err = '该账户名不存在';
        if(err) {
             res.send({
                done: false,
                msg: err
             });
            return;
        }
        //密码是否匹配
        if(password != user.password){
             res.send({
                done: false,
                msg: "密码错误"
             });
            return;
        
        }
        req.session.user = {name: user.name};
        res.send({
            done: true,
            url: '/',
            user: req.session.user
        });
    });
});

router.get('/reg', function(req, res, next) {
    res.render('reg', {
        title: 'Register',
        index: 'reg',
        user: req.session.user
    });
});

router.post('/reg', function(req, res, next) {
    //检验用户输入
    if(req.body.username == undefined || req.body.username == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.username.legnth > 15){
        res.send({
            done: false,
            msg: "账号长度不能大于15"
        });
        return;
    }
    if(req.body.password == undefined || req.body.password == ''){
        res.send({
            done: false,
            msg: "密码不能为空"
        });
        return;
    }else if(req.body.password.length <6 || req.body.password.legnth > 20){
        res.send({
            done: false,
            msg: "请确保密码长度为6-20"
        });
        return;
    }
    if(req.body.confirm_password != req.body.password){
        res.send({
            done: false,
            msg: "两次输入的口令不一致"
        });
        return;
    }
    
    //生成口令的数列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    //获取待处理数据
    var newUser = {
        name: req.body.username,
        password: password
    };
    
    //检查用户名是否已存在
    User.findByName(newUser.name, function(err, user) {
        if(user)
            err = '该账户名已存在';
        if(err) {
             res.send({
                done: false,
                msg: err
             });
            return;
        }
        //如果不存在新用户则新增加
        User.save(newUser, function(err) {
            if(err){
                res.send({
                    done: false,
                    msg: err
                });
                return;
            }
            res.send({
                done: true,
                url: '/user/login'
            });
        });
    });
});


router.get('/logout', function(req, res, next) {
    req.session.user = null;
    res.render('login', {
        title: 'Login',
        index: 'login',
        user: req.session.user
    });
});

module.exports = router;
