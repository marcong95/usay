var express = require('express');
var User = require("../../models/user");
var crypto = require('crypto');
var path = require('path');
var ejs = require('ejs');
var router = express.Router(); 
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

try{
    var config = require("../../configs/admin/config");   
}catch(e){
    
}

router.all("/", function(req, res, next) {
    if(!req.session.user) res.redirect("/manager/login");
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        title: '首页',
        user: req.session.user,
        config: config
    });
});

/* GET home page. */
router.get('/ajax', function(req, res, next) {
    res.render('admin/_index', {}, function(err, html){
        if(err){
            res.send( {
                done: false,
                msg: "系统错误"
            });
            return;
        }
        res.send( {
            done: true,
            html: html
        });
    });

});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('admin/login', {
        title: '登录'
    });
});
/* GET login page. */
router.post('/login', function(req, res, next) {
    req.session.user = { 
        username: "Wen",
        nickname: "jungleW",
        avator: "/admin/img/user2-160x160.jpg"
    };
    if(req.session.user){
        res.redirect("/admin/index");
    }else{
        res.redirect("/admin/login");
    }
});
/* GET login page. */
router.post('/ajax/login', function(req, res, next) {
    req.session.user = { 
        username: "Wen",
        nickname: "jungleW",
        avator: "/admin/img/user2-160x160.jpg"
    };
    res.send({
        done: true
    });
});
/* GET home page. */
router.get('/ajax/tableOptions', function(req, res, next) {
    req.session.user = user;
    res.send({
        done: false
    });
});
//锁屏
router.get('/ajax/lock', function(req, res, next) {
    res.render('admin/_lock', { user: req.session.user }, function(err, html){
            console.log(req.session.user);
            if(err){
                res.send( {
                    done: false,
                    msg: err
                });
                return;
            }
            res.send( {
                done: true,
                html: html
            });
    });
});
module.exports = router;
