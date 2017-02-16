let config = require('../configs/global.js')
let mongoose = require('mongoose')
let debug = require('debug')('usay:database')
let assert = require('assert')

mongoose.Promise = global.Promise
assert.notStrictEqual(config.db.options.user, null, 'username for DB auth is null')
assert.notStrictEqual(config.db.options.pass, null, 'password for DB auth is null')
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
