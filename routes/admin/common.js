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


router.get("/default/*", function(req, res, next) {console.log("ok")
    if(req.url == "/default/login") next();
    else if(!req.session.admin){
        res.redirect("/admin/common/default/login");
        return;
    }
    next();
});

router.post("/ajax/*", function(req, res, next) {
    if(req.url =="/ajax/login" ){
         next();
    }else if(!req.session.admin){
        res.send({
            "done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}
        });
        return;
    } 
    next();
});

/* GET login page. */
router.get('/default/login', function(req, res, next) {
    res.render('admin/login', {
        title: '登录'
    });
});
/* GET login page. */
router.post('/default/login', function(req, res, next) {
    req.session.admin = { 
        username: "Wen",
        nickname: "jungleW",
        avator: "/admin/img/user2-160x160.jpg"
    };
    if(req.session.admin){
        res.redirect("/admin/index/default/index");
    }else{
        res.redirect("/admin/common/default/login");
    }
});

/* GET home page. */
router.get('/ajax/tableOptions', function(req, res, next) {
    req.session.admin = admin;
    res.send({
        done: false
    });
});
//锁屏
router.get('/ajax/lock', function(req, res, next) {
    res.render('admin/_lock', { admin: req.session.admin }, function(err, html){
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
