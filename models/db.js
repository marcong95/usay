let config = require('../configs/global.js')
let mongoose = require('mongoose')
let debug = require('debug')('usay:database')
let assert = require('assert')

mongoose.Promise = global.Promise
mongoose.connect(config.db.url, config.db.config)
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
