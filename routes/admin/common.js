const co = require('co')
var express = require('express');
var User = require("../../models/user");
var crypto = require('crypto');
const CONST = require('../../models/constants')
var path = require('path');
var ejs = require('ejs');
var router = express.Router(); 
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


router.get("/default/*", function(req, res, next) {console.log("ok")
    if(req.url == "/default/login") next();
    else if(!req.session.admin){
        res.redirect("/admin/common/default/login");
        return;
    }
    next();
});

router.post("/ajax/*", function(req, res, next) {
    if(req.url =="/ajax/login" ){
         next();
    }else if(!req.session.admin){
        res.send({
            "done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}
        });
        return;
    } 
    next();
});

/* GET login page. */
router.get('/default/login', function(req, res, next) {
    res.render('admin/login', {
        title: '登录'
    });
});
/* GET login page. */
router.post('/default/login', function(req, res, next) {
    //检验用户输入
    if(req.body.username == undefined || req.body.username == ''){
        res.render('admin/login', {
            title: '登录',
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.username.legnth > 15){
         res.render('admin/login', {
            title: '登录',
            msg: "账号长度不能大于15"
        });
        return;
    }
    if(req.body.password == undefined || req.body.password == ''){
         res.render('admin/login', {
            title: '登录',
            msg: "密码不能为空"
        });
        return;
    }else if(req.body.password.length <6 || req.body.password.legnth > 20){
         res.render('admin/login', {
            title: '登录',
            msg: "请确保密码长度为6-20"
        });
        return;
    } 

    co(function*() {
		return yield User.login(req.body.username, req.body.password)
	}).then(function(user) {
        if(user.authority == "admin"){
		    req.session.admin = user
		    res.redirect("/admin/index/default/index")
        }else{
           res.render('admin/login', {
                title: '登录',
                msg: "权限不够"
            })
        }
	}, function(err) {
        let msg = "";
		switch(err) {
			case CONST.ERR_USER_NOT_FOUND:
				msg = '该账户名不存在'
				break
			case CONST.ERR_WRONG_PASSWORD:
				msg = '密码错误'
				break
			default:
				msg = '未知错误'
				debug(err, 'returned when login with', req.body)
				break
		}
         res.render('admin/login', {
            title: '登录',
            msg: msg
         })
	}).catch(function(err) {
        res.render('admin/login', {
            title: '登录',
            msg: err.toString()
        })
        console.log(err.stack)
    })
});

/* GET home page. */
router.get('/ajax/tableOptions', function(req, res, next) {
    req.session.admin = admin;
    res.send({
        done: false
    });
});
//锁屏
router.get('/ajax/lock', function(req, res, next) {
    res.render('admin/_lock', { admin: req.session.admin }, function(err, html){
            if(err){
                res.send( {
                    done: false,
                    msg: err
                });
                return;
            }
            res.send( {
                done: true,
                html: html
            });
    });
});
module.exports = router;
