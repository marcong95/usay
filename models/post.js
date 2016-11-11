var db = require("./db"); 
var mongoose = require("mongoose"); 
    
var PostSchema = new mongoose.Schema({
                     {
                      poster: String,
                      created: Date,
                      content: String,
                      upvoters: [{
                        from: String,
                        created: Date
                      }],
                      images: [{
                        order: Number,
                        url: String
                      }],
                      comments: [{
                        from: String,
                        to: String,
                        content: String,
                        created: Date
                      }]
                    }
                });
var PostModel = mongoose.model('post', PostSchema);

function Post(){};

/* 保存 */
Post.prototype.save = function(obj, callback) {
    var instance = new PostModel(obj);
    instance.save(function(err){
        callback(err);
    });
};
/* 更新 */
Post.prototype.update = function(search, obj, callback) {
    UserModel.update(search, {$set: obj}, function(err){
        callback(err);
    });
};
/* 删除 */
Post.prototype.delete = function(options, callback) {
    UserModel.remove(options, function(err){
        callback(err);
    });
};
/* 搜索 */
Post.prototype.search = function(options, callback) {
    UserModel.find(options, function(err, obj){
        callback(err, obj);
    });
};

/* 搜索一个 */
Post.prototype.searchOne = function(options, callback) {
    UserModel.findOne(options, function(err, obj) {
        callback(err, obj);
    });
};

module.exports = new Post();
