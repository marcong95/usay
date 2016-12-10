const co = require('co')
const debug = require('debug')('usay:server')
const express = require('express');
const CONST = require('../../models/constants')
const cfg = require('../../configs/global')
const db = require('../../models/db')
const Post = require('../../models/post')
const router = express.Router()

router.get("/*", function(req, res, next) {
    if(!req.session.user) res.redirect("/user/login");
    next();
});
/* GET  page. */
router.get('/', function(req, res, next) {
    res.render('user/post_form', {
        title: 'Post edit',
        index: 'post_form',
        toBack: true,
        toUploadFile: true,
        user: req.session.user
    });
});

router.post('/', function(req, res, next) {
    debug(req.body)
    var content = req.body.content;
    var img = [];
    console.log(content);
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

module.exports = router;