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


router.post('/', function(req, res, next) {
    var content = req.body.content;
    var img, imgStr = req.body.img_arr;
    if(imgStr && imgStr!==''){
         img = imgStr.split(",").map(function(elem){
            return {url: elem}
        });   
    }else{
        img = [];
    }
    //检验用户输入
    if(content == undefined || content == ''){
        res.send({
            done: false,
            msg: "内容不能为空"
        });
        return;
    }else if(content.legnth > 300){
        res.send({
            done: false,
            msg: "内容长度不能大于300"
        });
        return;
    }
    co(function*() {
		return yield Post.addPost(req.session.user, content, img);
	}).then(function(user) {
		res.send({
			done: true
		})
	}, function(err) {
        console.log(err);
		let respBody = { done: false }
		switch(err) {
			case CONST.ERR_USER_NOT_FOUND:
				respBody.msg = '该账户名不存在'
				break
			case CONST.ERR_WRONG_PASSWORD:
				respBody.msg = '密码错误'
				break
			default:
				respBody.msg = '未知错误'
				//debug(err.toString() + ' returned when login with ' + req.body)
				break
		}
        res.send(respBody)
	}).catch(function(err) {
        res.send({
            done: false,
            msg: err.toString()
        })
        console.log(err.stack)
    })
});

router.post('/del', function(req, res, next) {
    let postId = req.body.postId;
    console.log(postId)
    Post.delPost(postId).then(function(data){
        res.send({
            done: true,
            data: data
        })
    }, function(err){
        res.send({
            done: false,
            msg: err.toString()
        })
        console.log(arguments)
    })
});

router.get('/getList', function(req, res, next) {
    var currentPage = req.query.currentPage*1 || 1
    var pageSize = req.query.pageSize*1 || 10;
    var condition = { content: { 
        $regex: req.query.search == null || req.query.search == undefined ?
         '' : req.query.search } };     // search post
    var skip = (currentPage - 1) * pageSize, limit = pageSize;
    var totalPages;
    co(function*() {
        // here needs optimization someday
        let count = yield Post.getCount(condition);
        totalPages = Math.ceil(count/pageSize)
        let posts = yield Post.getPosts(condition, skip, limit)
        for (let post of posts) {
            post.poster = yield User.getUserById(post.poster)
            post.created = moment(post.created).format('YYYY/MM/DD HH:mm')
            if (!post.poster.avatar) {
                post.poster.avatar = cfg.user.defaultAvatar
            }
            for (let cmt of post.comments) {
                cmt.from = { _id: cmt.from, name: yield getUsername(cmt.from) }
                cmt.to = { _id: cmt.to, name: yield getUsername(cmt.to) }
            }
            console.log(post.upvoters)
            for (let cmt of post.upvoters) {
                cmt.from = { _id: cmt.from, name: yield getUsername(cmt.from) }
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
