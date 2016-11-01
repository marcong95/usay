var db = require("./db"); 
var mongoose = require("mongoose"); 
    
var UserSchema = new mongoose.Schema({
      name: String,
      password: String,
      image: String,
      gender: String,
      email: String,
      phone: String,
      motto: String,
      role: Number
});
var UserModel = mongoose.model('user', UserSchema);

function User(){};

/* 保存 */
User.prototype.save = function(obj, callback) {
    var instance = new UserModel(obj);
    instance.save(function(err){
        callback(err);
    });
};
/* 更新 */
User.prototype.update = function(search, obj, callback) {
    UserModel.update(search, {$set: obj}, function(err){
        callback(err);
    });
};
/* 删除 */
User.prototype.delete = function(options, callback) {
    UserModel.remove(options, function(err){
        callback(err);
    });
};
/* 搜索 */
User.prototype.search = function(options, callback) {
    UserModel.find(options, function(err, obj){
        callback(err, obj);
    });
};

/* 搜索一个 */
User.prototype.searchOne = function(options, callback) {
    UserModel.findOne(options, function(err, obj) {
        callback(err, obj);
    });
};

module.exports = new User();
