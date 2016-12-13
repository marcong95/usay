const co = require('co')
const debug = require('debug')('usay:server')
const express = require('express');
const CONST = require('../../models/constants')
const cfg = require('../../configs/global')
const db = require('../../models/db')
const Post = require('../../models/post')
const User = require('../../models/user')
var moment = require('moment');
const router = express.Router()

router.get("/*", function(req, res, next) {
    if(!req.session.user){
        res.redirect("/user/login?url=" + encodeURI(req.baseUrl));
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
    var currentPage = req.query.currentPage*1 || 1
    var pageSize = req.query.pageSize*1 || 10;
    var condition = {}, skip = (currentPage-1)*pageSize, limit = pageSize;
    var userId = req.session.user._id;
    var totalPage;
    co(function*() {
        // here needs optimization someday
        let user = yield User.getUserById(userId);
        let count = yield Post.getCount(condition);
        let totalPages = Math.ceil(count/pageSize)
        let followers = yield user.getFollowers()
        for (let follower of followers) {
            post.poster = yield User.getUserById(post.poster)
            post.created = moment(post.created).format('YYYY/MM/DD HH:mm')
            if (!post.poster.nickname) {
                post.poster.nickname = post.poster.username
            }
            if (!post.poster.avatar) {
                post.poster.avatar = cfg.user.defaultAvatar
            }
            for (let cmt of post.comments) {
                cmt.from = { _id: cmt.from, name: yield getUsername(cmt.from) }
                cmt.to = { _id: cmt.to, name: yield getUsername(cmt.to) }

            }
        }
        return followers
    }).then(function(data) {
        console.log(data)
        res.render('user/c_user', {
            title: 'User Collection',
            index: 'c_user',
            list: data,
            totalPage: totalPage,
            toSearch: true,
            user: req.session.user
        });
    }, console.log)
        .catch(console.log);
});

module.exports = router;
