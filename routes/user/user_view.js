const co = require('co')
const debug = require('debug')('usay:server')
const express = require('express');
const CONST = require('../../models/constants')
const cfg = require('../../configs/global')
const db = require('../../models/db')
const Post = require('../../models/post')
const User = require('../../models/user')
var moment = require('moment');
var router = express.Router();

router.get("/*", function(req, res, next) {
    if(!req.session.user && !req.query.userid){
        res.redirect("/user/login?url=" + encodeURIComponent(req.baseUrl));
        return;
    }
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
    let isMe = false
    // console.log(condition, req.session.user);
    // console.log(req.session.user._id);
    co(function*() {
        let _id = req.query.userid
        if(!_id || _id == "null"){
            if(req.session.user){
                _id = req.session.user._id
                isMe = true
            }else{
                res.send({
                    done: false,
                    msg: "用户未登录 && userId为空"
                })
                return;
            }
        }
        if( !isMe && req.session.user && _id == req.session.user._id){
            isMe = true
        }
        // id specified, fetch user info
        let user = yield User.getUserById(_id);
        return user;
    }).then(function(user) {
        console.log(user)
        if (!user.avatar) {
            user.avatar = cfg.user.defaultAvatar;
        }
        res.render('user/user_view', {
            title: 'Ushare | user',
            index: 'user_view',
            isMe: isMe,
            toBack: true,
            toSearch: true,
            me: req.session.user,
            user
        });
    }, function(err) {
        console.log(err);
    })
});

module.exports = router;
