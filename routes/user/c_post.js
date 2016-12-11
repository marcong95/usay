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

/* GET home page. */
router.get('/', function(req, res, next) {
    var currentPage = req.query.currentPage*1 || 1
    var pageSize = req.query.pageSize*1 || 20;
    var condition = {}, skip = (currentPage-1)*pageSize, limit = pageSize;
    var userId = req.session.user._id;
    var totalPage;
    co(function*() {
            // here needs optimization someday
            let user = yield User.getUserById(userId);
            let count = yield Post.getCount(condition);
            totalPage = Math.ceil(count/pageSize)
            let posts = yield user.getFavouritePosts()
            console.log(posts)
            for (let post of posts) {
                post.poster = yield User.getUserById(post.poster)
                post.created = moment(post.created).format('YYYY年MM月DD日')
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
            return posts
        }).then(function(data) {
            res.render('user/c_post', {
                title: 'Post Collection',
                index: 'c_post',
                toSearch: true,
                totalPage: totalPage,
                postList: data,
                user: req.session.user
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
