const co = require('co')
const debug = require('debug')('usay:server')
const express = require('express');
const CONST = require('../../models/constants')
const cfg = require('../../configs/global')
const db = require('../../models/db')
const Post = require('../../models/post')
const User = require('../../models/user')
const moment = require('moment');
const router = express.Router()

router.get('/users', function(req, res, next) {
    let currentPage = req.query.currentPage * 1 || 1
    let pageSize = req.query.pageSize * 1 || 10
    let condition = { content: { 
        $regex: req.query.search == null || req.query.search == undefined ?
         '' : req.query.search } }
    let skip = (currentPage-1)*pageSize, limit = pageSize
    User.getUsers(condition, {
        _id: true, username: true, nickname: true
    }, skip, limit)
        .then(function(users) {
            res.send({
                done: true,
                users
            });
        }, () => _wrapErrmsg(err))
        .catch(() => _wrapErrmsg(err));
});

router.get('/favourites', function(req, res, next) {
    let currentPage = req.query.currentPage * 1 || 1
    let pageSize = req.query.pageSize * 1 || 10;
    let condition = { content: { 
        $regex: req.query.search == null || req.query.search == undefined ?
         '' : req.query.search } }
    let skip = (currentPage - 1)*pageSize, limit = pageSize
    co(function*() {
        // TODO: finish
        let user
        if (req.query.id) {
            user = yield User.getUserById(req.query.id)
        } else {
            user = req.session.user.favourites
            // user = yield User.getUserById(req.session.user._id)
        }
        condition._id = {$in: user.favourites.map((elmt) => elmt.to)}
        return yield Post.posts(condition, skip, limit)
    })
        .then(function(users) {
            res.send({
                done: true,
                posts
            })
        }, () => _wrapErrmsg(err))
        .catch(() => _wrapErrmsg(err))
})

router.get('/myposts', function(req, res, next) {
    let currentPage = req.query.currentPage * 1 || 1
    let pageSize = req.query.pageSize * 1 || 10;
    let condition = { content: { 
        $regex: req.query.search == null || req.query.search == undefined ?
         '' : req.query.search } }
    let skip = (currentPage - 1)*pageSize, limit = pageSize
    Post.posts(condition, skip, limit)
        .then(function(posts) {
            res.send({
                done: true,
                posts
            })
        }, () => _wrapErrmsg(err))
        .catch(() => _wrapErrmsg(err))
})

function _wrapErrmsg(err) {
    return {
        done: false,
        msg: err || err.toString()
    }
}

module.exports = router;
