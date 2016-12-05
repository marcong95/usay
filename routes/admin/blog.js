var express = require('express');
var crypto = require('crypto');
var Blog = require("../../models/blog");
var path = require('path');
var ejs = require('ejs');
var router = express.Router();

var app = express();

/* GET blog page. */
router.get('/ajax', function(req, res, next) {
    //搜索博文
    Blog.search({}, function(err, data) {
        app.render('admin/_blog', {
            table:{
                id: "table",
                titles: [
                    {name: '标题', label: 'title', url: ''}, 
                    {name: '作者', label: 'author'}, 
                    {name: '阅读量', label: 'view'}, 
                    {name: '点赞', label: 'like'},  
                    {name: '操作', opers: 
                        [  
                            {name: '详情',  oper: 'show'}, 
                            {name: '编辑',  oper: 'edit'}, 
                            {name: '删除',  oper: 'del'}
                        ]
                    }
                ],
                list: data
            }
        }, function(err, html){
            res.send({
                title:"博文",
                html: html,
                table:{
                    id: "table",
                    noSortArr: [4]
                },
                done: true
            });
        });
    });
});
/* GET table status page. */
router.get('/ajax/tableOptions', function(req, res, next) {
    //表格修饰
    res.send({
        title:"博文",
        table:{
            id: "table",
            noSortArr: [4]
        },
        done: true
    });
});

/* GET blog list page. */
router.get('/ajax/list', function(req, res, next) {
    //搜索博文
    Blog.search({}, function(err, data) {
        res.send({
            blogs: data,
            user: req.session.user
        });
    });
});

//添加博文
router.get('/ajax/edit', function(req, res, next) {
    res.render('admin/_blog_edit', {
        title: 'Blog_edit',
        index: 'blog_edit',
        blog: ""
    });
});
//修改博文
router.get('/ajax/edit/:id', function(req, res, next) {
    var id = req.params.id;
    Blog.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_blog_edit', {
            title: 'Blog_edit',
            index: 'blog_edit',
            blog: data
        });
    });
});

router.get('/ajax/show/:id', function(req, res, next) {
    var id = req.params.id;
    Blog.searchOne({"_id": id}, function(err, data) {
        res.render('admin/_blog_show', {
            title: 'blog_show',
            index: 'blog_show',
            blog: data
        });
    });
});
router.post('/ajax/del/:id', function(req, res, next) {
    var id = req.params.id;
    Blog.delete({_id: id}, function(err) {
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
router.post('/ajax/update', function(req, res, next) {
    var id = req.body.id;
    //检验博文输入
    if(req.body.title == undefined || req.body.title == ''){
        res.send({
            done: false,
            msg: "标题不能为空"
        });
        return;
    }else if(req.body.title.legnth > 15){
        res.send({
            done: false,
            msg: "标题不能大于15"
        });
        return;
    }
    if(req.body.content == undefined || req.body.content == ''){
        res.send({
            done: false,
            msg: "博文内容不能为空"
        });
        return;
    }
    //获取待处理数据
    var newBlog = {
        title: req.body.title,
        author: "test",
        updateTime: "2016-08-09",
        abstract: "摘要",
        content: req.body.content,
        view: 0,
        like: 0,
        talk: 0
    };
    
    //检查用户名是否已存在
    if(id){    
        Blog.searchOne({"_id":id}, function(err, blog) {
            if(err){
                 res.send({
                    done: false,
                    msg: "数据库访问异常"
                 });
                return;
            }
            Blog.update({"_id": blog._id}, newBlog, function(err, blog) {
                if(err){   
                     console.log("update f");
                     res.send({
                        done: false,
                        msg: "数据库访问异常"
                     });
                    return;
                }
                console.log("updata s");
                res.send({
                    done: true,
                    msg:"更新成功"
                });
                return;
            });

        });
    } else {
        Blog.save(newBlog, function(err, blog) {
            if(err){
                console.log("save f");
                 res.send({
                    done: false,
                    msg: "数据库访问异常"
                 });
                return;
            }
            console.log("save s");
            res.send({
                done: true,
                msg:"添加成功"
            });
            return;
        });
    } 
});

module.exports = router;
