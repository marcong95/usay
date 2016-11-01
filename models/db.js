 var mongoose = require("mongoose"); 
 var db = mongoose.connect("mongodb://119.29.91.217:27017/myBlog"); 
//var db = null;
 exports.db = db;