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

router.get('/', function(req, res, next) {
    var currentPage = req.query.currentPage*1 || 1
    var pageSize = req.query.pageSize*1 || 10;
    var condition = {}, skip = (currentPage-1)*pageSize, limit = pageSize;
    var userId = req.session.user._id;
    var totalPages;
    co(function*() {
        // here needs optimization someday
        let user = yield User.getUserById(userId);
        let count = yield user.getFollowedCount()
        totalPages = Math.ceil(count/pageSize)
        let followeds = yield user.getFollowed()
        for (let followed of followeds) {
            followed.to = yield User.getUserById(followed.to)
            followed.created = moment(followed.created).format('YYYY/MM/DD HH:mm')
            if (!followed.to.avatar) {
                followed.to.avatar = cfg.user.defaultAvatar
            }
        }
        return followeds
    }).then(function(data) {
        res.render('user/c_user', {
            title: 'Ushare | follow',
            index: 'c_user',
            list: data,
            totalPages: totalPages,
            toSearch: true,
            me: req.session.user
        });
    }, console.log)
        .catch(console.log);
});

module.exports = router;
