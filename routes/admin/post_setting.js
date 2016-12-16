var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();
var path = require('path');
var ejs = require('ejs');
var moment = require('moment');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

router.get("/default/*", function(req, res, next) {
    if(!req.session.admin){
        res.redirect("/admin/common/default/login");
        return;
    } 
    next();
});
router.get("/ajax/*", function(req, res, next) {
    if(!req.session.admin){
        res.send({"done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}});
        return;
    }
    next();
});
router.post("/ajax/*", function(req, res, next) {
    if(!req.session.admin){
        res.send({"done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}});
        return;
    }
    next();
});
/* GET User page. */
router.get('/ajax/index', function(req, res, next) {
    let id = req.session.admin._id;
   User.getUserById(id).then(function(user) {
       var text = user.bantext;
       text = text.substring(text.indexOf("#")+1);
       res.render("admin/_post_setting", {
           text: text
       }, function(err, html){
            res.send({
                title:"分享设置",
                html: html,
                done: true
            });
        });
   });  
});

//修改分享设置
router.post('/ajax/ban', function(req, res, next) {
    let id = req.session.admin._id;
    let text = req.body.bantext;
    User.getUserById(id).then(function(user) {
        user.modify('bantext', text).then(function(){
            res.send({
                done: true
            });
        },function(err){
            res.send({
                done: false,
                dealMsg:{
                    state: "error",
                    html:"分享设置成功"
                } 
            });
        })
    }, function(err) {
        res.send({
            done: false,
            dealMsg:{
                state: "error",
                html:"分享设置失败"
            } 
        });
    });
});



module.exports = router;
