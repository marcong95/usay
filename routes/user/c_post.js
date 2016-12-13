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
        res.redirect("/user/login?url=" + encodeURIComponent(req.baseUrl));
        return;
    }
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var currentPage = req.query.currentPage*1 || 1
    var pageSize = req.query.pageSize*1 || 10;
    var condition = {}, skip = (currentPage-1)*pageSize, limit = pageSize;
    var userId = req.session.user._id;
    var totalPages;
    co(function*() {
            // here needs optimization someday
            let user = yield User.getUserById(userId);
            let count = yield user.getFavouritedCount()
            totalPages = Math.ceil(count/pageSize)
            let c_posts = yield user.getFavourited()
            for (let c_post of c_posts) {
                var post = c_post.to
                if(!post){
                    delete c_posts[c_posts.indexOf(c_post)]
                    continue;   
                }
                c_post.created = moment(c_post.created).format('YYYY年MM月DD日')
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
            return c_posts
        }).then(function(data) {
            res.render('user/c_post', {
                title: 'Ushare | collection',
                index: 'c_post',
                toSearch: true,
                totalPages: totalPages,
                postList: data,
                me: req.session.user
            })
        }, console.log)
        .catch(console.log);
});

let usernames = new Map()
function getUsername(id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            resolve(null)
        } else if (usernames.has(id)) {
            resolve(usernames.get(id))
        } else {
            co(function*() {
                let user = yield User.getUserById(id)
                usernames.set(id, user.username)
                // debug(id, user.username)
                return user.username
            }).then(resolve, reject).catch(reject)
        }
    })
}
module.exports = router;
