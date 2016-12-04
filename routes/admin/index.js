var express = require('express');
var User = require("../../models/user");
var crypto = require('crypto');
var path = require('path');
var ejs = require('ejs');
var router = express.Router(); 
var app = express();
// view engine setup
app.engine('.html', ejs.__express);
app.set('view engine', 'html');


try{
    var config = require("../../configs/admin/config");   
}catch(e){
    
}

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.user) res.redirect("/admin/login");
     //搜读者
    User.search({}, function(err, data) { 
        //req.session.user = data[0];
        res.render('admin/index', {
            title: '首页',
            user: req.session.user,
            config: config
        });
    });
});

/* GET test page. */
router.get('/test/:n/:role', function(req, res, next) {
    var user = {
        _id: "123",
        name: "wjz",
        role: 1,
        password: "123456",
        nickName: "jungle",
        image:"/admin/img/user3-128x128.jpg",
        gender:"male"
    }
    var role = req.params.role;
    //User.search({}, function(err, data) {
        req.session.user = user;
        res.render('admin/index', {
            title: '首页',
            user: req.session.user,
            config: config
        });
    //});
});
/* GET test page. */
router.get('/role/:role', function(req, res, next) {
    req.session.user = {
        name: "wjz",
        image: "/admin/img/user3-128x128.jpg",
        role: req.params.role
    }
    res.render('admin/index', {
        title: '首页',
        user: req.session.user
    });
});

/* GET home page. */
router.get('/ajax', function(req, res, next) {console.log("1");
    app.render('admin/_index', {}, function(err, html){console.log("2");
        if(err){
            res.send( {
                done: false
            });
            return;
        }console.log("3");
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
        name: "jungleW",
        image: "/admin/img/user2-160x160.jpg"
    };
    if(req.session.user){
        res.redirect("/admin/index");
    }else{
        res.redirect("/admin/login");
    }
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
    //var id = req.session.user._id;
    var data = req.session.user;
    //User.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_lock', {
            title: 'User_edit',
            index: 'user_edit',
            user: data
        });
    //});
});
module.exports = router;
