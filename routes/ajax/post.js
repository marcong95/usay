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


router.get('/getList', function(req, res, next) {
    let currentPage = req.query.currentPage*1
    let pageSize = req.query.pageSize*1;
    var condition = {}, skip = (currentPage-1)*pageSize, limit = pageSize;
    co(function*() {
        // here needs optimization someday
        let count = yield Post.getCount(condition);
        let totalPages = Math.ceil(count/pageSize)
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
            for (let cmt of post.comments) {
                cmt.from = { _id: cmt.from, name: yield getUsername(cmt.from) }
                cmt.to = { _id: cmt.to, name: yield getUsername(cmt.to) }

            }
        }
        return {
            done: true,
            list: posts,
            pageInfo: {
                currentPage:currentPage,
                user: req.session.user,
                pageSize: pageSize,
                totalPages: totalPages
            }
        }
    }).then(function(data) {
        // debug(data)
        res.send(data)
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
