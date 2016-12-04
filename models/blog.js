var db = require("./db"); 
var mongoose = require("mongoose"); 
    
var BlogSchema = new mongoose.Schema({
    title: String,
    author: String,
    updateTime: String,
    abstract: String,
    content: String,
    view: Number,
    like: Number,
    talk: Number,
    comment: String
});
var BlogModel = mongoose.model('blog', BlogSchema);

function Blog(){};

/* 保存 */
Blog.prototype.save = function(obj, callback) {
    var instance = new BlogModel(obj);
    instance.save(function(err){
        callback(err);
    });
};
/* 更新 */
Blog.prototype.update = function(search, obj, callback) {
    BlogModel.update(search, {$set: obj}, function(err){
        callback(err);
    });
};
/* 删除 */
Blog.prototype.delete = function(options, callback) {
    BlogModel.remove(options, function(err){
        callback(err);
    });
};
/* 搜索 */
Blog.prototype.search = function(options, callback) {
    BlogModel.find(options, function(err, obj){
        callback(err, obj);
    });
};

/* 搜索一个 */
Blog.prototype.searchOne = function(options, callback) {
    BlogModel.findOne(options, function(err, obj) {
        callback(err, obj);
    });
};

module.exports = new Blog();
