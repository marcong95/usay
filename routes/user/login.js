const co = require('co')
const express = require('express');
const CONST = require('../../models/constants')
const db = require('../../models/db')
const pwd = require('../../models/password')
const User = require('../../models/user')
const router = express.Router()

// require('../../common/promise-extend')

router.get('/', function(req, res, next) {
    res.render('user/login', {
        title: 'Login',
        index: 'login',
        user: req.session.user
    });
});

router.get('/check_session', function(req, res, next) {
    if(req.session.user){
        res.send(true);
    }else{
        res.send(false);
    }
});

router.post('/', function(req, res, next) {
    //检验用户输入
    if(req.body.username == undefined || req.body.username == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.username.legnth > 15){
        res.send({
            done: false,
            msg: "账号长度不能大于15"
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
    
<<<<<<< HEAD
    //获取待处理数据
    var newUser = {
        username: req.body.username,
        password: password
    };
        
    //检查用户名是否已存在
    User.searchOne({username: newUser.username}, function(err, user) {
        if(!user)
            err = '该账户名不存在';
        if(err) {
             res.send({
                done: false,
                msg: err
             });
            return;
        }  
        //密码是否匹配
        if(password != user.password){
             res.send({
                done: false,
                msg: "密码错误"
             });
            return;
        
        }    
        req.session.user = {username: user.username, userId: "123"};
        res.send({
            done: true,
            user: req.session.user
        });
    });
=======
    co(function*() {
		return yield User.login(req.body.username, req.body.password)
	}).then(function(user) {
        console.log(user)
		req.session.user = user
		res.send({
			done: true,
			url: '/',
			user: req.session.user
		})
	}, function(err) {
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
				debug(err + ' returned when login with ' + req.body)
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
>>>>>>> refs/remotes/origin/pr/1
});

module.exports = router;
