const co = require('co')
const debug = require('debug')('usay:server')
const express = require('express');
const CONST = require('../../models/constants')
const cfg = require('../../configs/global')
const db = require('../../models/db')
const pwd = require('../../models/password')
const User = require('../../models/user')
const router = express.Router()

router.get('/', function(req, res, next) {
    res.render('user/reg', {
        title: 'Ushare | register',
        index: 'reg',
        toBack: true,
        user: req.session.user
    });
});

router.post('/', function(req, res, next) {
    //检验用户输入
    if(req.body.username == undefined || req.body.username == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }
    if(req.body.password == undefined || req.body.password == ''){
        res.send({
            done: false,
            msg: "密码不能为空"
        });
        return;
    }else if(req.body.password.length <6 || req.body.password.legnth > 20){
        res.send({
            done: false,
            msg: "请确保密码长度为6-20"
        });
        return;
    }
    if(req.body.confirm_password != req.body.password){
        res.send({
            done: false,
            msg: "两次输入的口令不一致"
        });
        return;
    }
    
    co(function*() {
		return yield User.register(req.body.username, req.body.password)
	}).then(function(user) {
		res.send({
			done: true,
			url: '/user/login'
		})
        debug(user.username + ' registered')
	}, function(err) {
		let respBody = { done: false }
		switch(err) {
			case CONST.ERR_USERNAME_ALREADY_EXISTS:
				respBody.msg = '该用户名已被占用'
				break
            case CONST.ERR_USERNAME_ILLEGAL:
                respBody.msg = cfg.user.usernameRule.msg
                break
            case CONST.ERR_PASSWORD_ILLEGAL:
                respBody.msg = cfg.user.passwordRule.msg
                break
			default:
				respBody.msg = '未知错误'
				debug(err.toString().slice(7, -1) + ' returned when register ' 
                    + req.body.username)
				break
		}
        res.send(respBody)
	}).catch(function(err) {
        res.send({
            done: false,
            msg: err.toString()
        })
        debug(err.stack)
    })
});

module.exports = router;
