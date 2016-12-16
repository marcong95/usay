var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();
var path = require('path');
var ejs = require('ejs');
var moment = require('moment');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

router.get("/default/*", function(req, res, next) {
    if(!req.session.admin){
        res.redirect("/admin/common/default/login");
        return;
    } 
    next();
});
router.get("/ajax/*", function(req, res, next) {
    if(!req.session.admin){
        res.send({"done": false, "dealMsg": {"state": "notLogin", "msg": "Not login"}});
        return;
    }
    next();
});

/* GET User page. */
router.get('/ajax/index', function(req, res, next) {
    var projection = {"username":true, 'nickname':true, 'authority':true,'followers':true, 'favourites':true,'upvoteds':true,'created':true};
    var skip = 0;
    var limit = 1000;
    //搜用户
    User.getUsers({'baned': true}, projection, skip, limit, true).then(function(data) {
        console.log(data);
        for (let elmt of data) {
            for (let prop in elmt) {
                if (elmt[prop] instanceof Array) {
                    elmt[prop] = elmt[prop].length || 0
                }
            }
            elmt.created = moment(elmt.created).format('YYYY-MM-DD HH:mm:ss')
        }
        res.render('admin/_user', {
            table:{
                id: "table",
                titles: [
                    {name: '账号', label: 'username', url: ''}, 
                    {name: '昵称', label: 'nickname'},
                    {name: '角色', label: 'authority'},
                    {name: '关注数', label: 'followers'},
                    {name: '收藏数', label: 'favourites'},
                    {name: '点赞数', label: 'upvoteds'},
                    {name: '注册时间', label: 'created'},
                    {name: '操作', opers: 
                        [  
                            {name: '详情',  oper: 'show'}, 
                            {name: '解除冻结',  oper: 'release'}
                        ]
                    }
                ],
                list: data
            }
        }, function(err, html){
            res.send({
                title:"读者",
                html: html,
                table:{
                    id: "table",
                    noSortArr: [7]
                },
                done: true
            });
        });
    }, function(err) {
    
    
    });

});

/* GET User list page. */
router.get('/ajax/list', function(req, res, next) {
    //用户列表
    User.search({}, function(err, data) {
        res.send({
            Users: data,
            user: req.session.user
        });
    });
});


router.get('/ajax/show/:id', function(req, res, next) {
    var id = req.params.id;
    User.getUserById(id).then(function(data) {
        console.log(data);
        res.render('admin/_user_show', {
           user: data,
           me: req.session.admin,
        }, function(err, html){
            res.send({
                title:"读者",
                html: html,
                done: true
            });
        });
    }, function(err) {
    
    
    });
});
//修改用户
router.get('/ajax/edit', function(req, res, next) {
    res.render('admin/_user_edit', {
        title: 'User_edit',
        index: 'user_edit',
        user: {}
    });
});
//修改用户
router.get('/ajax/edit/:id', function(req, res, next) {
    var id = req.params.id;
    User.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_user_edit', {
            title: 'User_edit',
            index: 'user_edit',
            user: data,
            me: req.session.user
        });
    });
});



router.post('/ajax/del/:id', function(req, res, next) {
    var id = req.params.id;
    User.delete({_id: id}, function(err) {
        if(err){        
            res.send({
                done: false,
                msg: "删除失败"
            });
            return;
        } else {
            res.send({
                done: true,
                msg: "删除成功"
            });
            return;
        }

    });
});
router.post('/ajax/release/:id', function(req, res, next) {
    var id = req.params.id;
    User.getUserById(id).then(function(user) {
        user.modify('baned', false).then(function(){
            res.send({
                done: true
            });
        },function(err){
            res.send({
                done: false,
                dealMsg:{
                    state: "error",
                    html:"删除失败"
                } 
            });
        })
    }, function(err) {
        res.send({
            done: false,
            dealMsg:{
                state: "error",
                html:"删除失败"
            } 
        });
    });
});
router.post('/ajax/update', function(req, res, next) {
    var _id = req.body._id;
    //检验用户输入
    if(req.body.name == undefined || req.body.name == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.name.legnth > 15){
        res.send({
            done: false,
            msg: "账号长度不能大于15"
        });
        return;
    }
    //获取待处理数据
    var newUser = req.body;
    
    if(_id){
        //检查用户名是否已存在
        User.searchOne({_id: {"$ne": _id}, name: newUser.name}, function(err, user) {
            if(user)
                err = '该账户名已存在';
            if(err) {
                 res.send({
                    done: false,
                    msg: err
                 });
                return;
            }
            //如果不存在新用户则新增加
            User.update({"_id": newUser._id}, newUser, function(err) {
                if(err){
                    res.send({
                        done: false,
                        msg: "更新失败"
                    });
                    return;
                }
                res.send({
                    done: true,
                    msg: "更新成功"
                });
            });
        });
    }else{
        //检查用户名是否已存在
        User.searchOne({name: newUser.name}, function(err, user) {
            if(user)
                err = '该账户名已存在';
            if(err) {
                 res.send({
                    done: false,
                    msg: err
                 });
                return;
            }
            //如果不存在新用户则新增加
            User.save(newUser, function(err) {
                if(err){
                    res.send({
                        done: false,
                        msg: "更新失败"
                    });
                    return;
                }
                res.send({
                    done: true,
                    msg: "更新成功"
                });
            });
        });
    }
});
router.post('/ajax/resetPwd', function(req, res, next) {
    var id = req.body._id;
    console.log(id);
    //检验用户输入
    console.log(req.body);
    if(req.body.name == undefined || req.body.name == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.name.legnth > 15){
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
    //生成口令的数列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    //获取待处理数据
    var newUser = {
        name: req.body.name,
        password: password
    };
    
    if(id){
        //检查用户名是否已存在
        User.searchOne({_id: {"$ne": id}, name: newUser.name}, function(err, user) {
            if(user)
                err = '该账户名已存在';
            if(err) {
                 res.send({
                    done: false,
                    msg: err
                 });
                return;
            }
            //如果不存在新用户则新增加
            User.update({"_id": user.id}, newUser, function(err) {
                if(err){
                    res.send({
                        done: false,
                        msg: "更新失败"
                    });
                    return;
                }
                res.send({
                    done: true,
                    msg: "更新成功"
                });
            });
        });
    }else{
        //检查用户名是否已存在
        User.searchOne({name: newUser.name}, function(err, user) {
            if(user)
                err = '该账户名已存在';
            if(err) {
                 res.send({
                    done: false,
                    msg: err
                 });
                return;
            }
            //如果不存在新用户则新增加
            User.save(newUser, function(err) {
                if(err){
                    res.send({
                        done: false,
                        msg: "更新失败"
                    });
                    return;
                }
                res.send({
                    done: true,
                    msg: "更新成功"
                });
            });
        });
    }
});
router.post('/login', function(req, res, next) {       
    //检验用户输入
    if(req.body.name == undefined || req.body.name == ''){
        res.send({
            done: false,
            msg: "账号不能为空"
        });
        return;
    }else if(req.body.name.legnth > 15){
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
    //生成口令的数列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    //获取待处理数据
    var newUser = {
        name: req.body.name,
        password: password
    };
    
    //检查用户名是否已存在
    User.searchOne({name: newUser.name}, function(err, user) {
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
        res.send({
            done: true,
            url: '/',
            user: req.session.user
        });
    });
});

module.exports = router;
