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
    var _id = req.query.id;
    if(!_id) next();
    var condition = { _id },skip=0, limit=100;
    console.log(condition, req.session.user);
    console.log(req.session.user._id);
    Post.getPosts(condition, skip, limit).then(
        function(data) {
            console.log(data);
            res.render('user/user_view', {
                title: 'Post Collection',
                index: 'user_view',
                toBack: true,
                toSearch: true,
                user: req.session.user
            });
        },
        function(err){
            console.log(err);
        }
    );

});

module.exports = router;
