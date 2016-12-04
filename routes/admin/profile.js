var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();
var path = require('path');
var ejs = require('ejs');
var router = express.Router();

var app = express();
// view engine setup
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

/* GET User page. */
router.get('/ajax', function(req, res, next) {
    //个人信息
    var id = req.session.user._id;
    User.searchOne({"_id": id}, function(err, data) {
        app.render('admin/_user_show', {
            index: 'user_show',
            user: data,
            me: req.session.user
        }, function(err, html){
            res.send({
                title: 'User_show',
                html: html,
                done: true
            });
        });
    });
});

//修改信息
router.get('/ajax/edit', function(req, res, next) {
    var id = req.session.user._id;
    User.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_user_edit', {
            title: 'User_edit',
            index: 'user_edit',
            user: data
        });
    });
});
//修改密码
router.get('/ajax/resetPwd', function(req, res, next) {
    //var id = req.session.user._id;
    var file = res.render("admin/_password_rest");
    console.log(file);
    var data = req.session.user;
    //User.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_password_reset', {
            title: 'User_edit',
            index: 'user_edit',
            User: data
        });
    //});
});

module.exports = router;
