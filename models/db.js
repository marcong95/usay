<<<<<<< HEAD
 var mongoose = require("mongoose"); 
var db = mongoose.connect("mongodb://119.29.91.217:27017/Usay"); 
//var db = null;
 exports.db = db;
=======
let config = require('../configs/global.js')
let mongoose = require('mongoose')
let debug = require('debug')('usay:database')
let assert = require('assert')

mongoose.Promise = global.Promise
mongoose.connect(config.db.url)
let db = mongoose.connection
db.on('error', function(err) {
  debug('connection error ' + err)
})
db.once('open', function() {
  debug('connection opened')
})
db.once('close', function() {
  debug('connection closed')
})

module.exports = db
>>>>>>> refs/remotes/origin/pr/1
