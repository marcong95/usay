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
    var condition = {}, skip=0, limit=100;
    Post.getPosts(condition, skip, limit).then(
        function(data) {
            for(var elmt of data){
                elmt.poster = {
                    _id: elmt.poster,
                    username: "name",
                    avator: "/common/images/avator/user2-160x160.jpg"
                }
                elmt.created = moment(elmt.created).format('YYYY/MM/DD HH:mm')
            }
            // console.log(data);
            res.render('user/index', {
                title: 'Home',
                index: 'index',
                toSearch: true,
                postList: data,
                user: req.session.user
            });
        },
        function(err){
            console.log(err);
        }
    );
});

module.exports = router;
