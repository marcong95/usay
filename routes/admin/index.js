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

router.get("/default/*", function(req, res, next) {
    if(!req.session.admin){
        res.redirect("/admin/common/default/login");
        return;
    }
    console.log("ok")
    next();
});
router.get("/ajax/*", function(req, res, next) {
    if(!req.session.admin) res.send({"done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}});
    next();
});

/* GET home page. */
router.get('/default/index', function(req, res, next) {
    console.log("hehr")
    res.render('admin/index', {
        title: '首页',
        admin: req.session.admin,
        config: config
    });
});

/* GET home page. */
router.get('/ajax/index', function(req, res, next) {
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
module.exports = router;
