var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var Post = require("../../models/post");
var router = express.Router();
var path = require('path');
var ejs = require('ejs');


/* GET item by id */
router.get('/view', function(req, res, next) {
    
});

/* GET list by pageNum, amount, search string */
router.get('/list', function(req, res, next) {

});

//edit
router.get('/edit', function(req, res, next) {
    res.render('admin/_user_edit', {
        title: 'User_edit',
        index: 'user_edit',
        user: {}
    });
});

router.post('/del', function(req, res, next) {

});
router.post('/update', function(req, res, next) {
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

router.post('/upvote', function(req, res, next) {
    let user = req.session.user;
    let postId = User._unifyId(req.body.postId);
    let oper = req.body.oper;
    if(oper == "add"){
        console.log(user)
        user.upvote(postId).then(function(){
            console.log("ok")
        }, function(){

        });
    }else if(oper == "del"){
        
    }
});

router.post('/comment', function(req, res, next) {
    let content = req.body.content;
    let postId = req.body.postId;
    let userId = User._unifyId(req.body.userId);
    let oper = req.body.oper;
    console.log(postId)
    if(oper == "add"){
        Post.getPostById(postId).then(function(post) {
            post.addComment(content, req.session.user, userId).then(function(data){
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
        }, console.log)
    }else if(oper == "del"){
        
    }
});

module.exports = router;
