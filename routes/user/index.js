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

/* GET home page. */
router.get('/', function(req, res, next) {
    var condition = {}, skip = 0, limit = 100;
    co(function*() {
        // here needs optimization someday
        let posts = yield Post.getPosts(condition, skip, limit)
        for (let post of posts) {
            post.poster = yield User.getUserById(post.poster)
            post.created = moment(post.created).format('YYYY/MM/DD HH:mm')
            if (!post.poster.nickname) {
                post.poster.nickname = post.poster.username
            }
            if (!post.poster.avatar) {
                post.poster.avatar = cfg.user.defaultAvatar
            }
        }
        return posts
    }).then(function(data) {
        debug(data)
        res.render('user/index', {
            title: 'Home',
            index: 'index',
            toSearch: true,
            postList: data,
            user: req.session.user
        })
    }, console.log)
        .catch(console.log);
});

module.exports = router;
