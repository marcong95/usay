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

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // console.log(condition, req.session.user);
    // console.log(req.session.user._id);
    co(function*() {
        var _id;
        var condition = { poster: _id }, skip=0, limit=100;
        if (req.query.id) {
            // id specified, fetch user info
            _id = req.query.id;
            let [user, post] = yield [User.getUserById(_id), 
                Post.getPosts(condition, skip, limit)];
            user.posts = post;
            return user;
        } else if (req.session.user) {
            // id not specifed, but user has logged in, 
            // use user info in session instead
            _id = req.session.user._id;
            let post = yield Post.getPosts(condition, skip, limit);
            let user = req.session.user;
            user.posts = post;
            return user;
        } else {
            // otherwise, redirect to home page
            res.redirect('/');
        }
    }).then(function(fetched) {
        console.log(fetched)
        if (!fetched.nickname) {
            fetched.nickname = fetched.username;
        }
        if (!fetched.avatar) {
            fetched.avatar = cfg.user.defaultAvatar;
        }
        res.render('user/user_view', {
            title: 'Post Collection',
            index: 'user_view',
            toBack: true,
            toSearch: true,
            user: req.session.user,
            fetched
        });
    }, function(err) {
        console.log(err);
    })
});

module.exports = router;
