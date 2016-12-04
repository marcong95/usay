let co = require('co')
let debug = require('debug')('usay:server')
let db = require('../models/db')
let User = require('../models/user')

require('../common/promise-extend')

co(function*() {
  yield User.register('marco', 'LongLiveChina')
  let user = yield User.login('marco', 'LongLiveChina')
  // let user yield user.modify('bio', 'modify tested at ' + new Date().toString())
  // yield User.login('marco', 'FireInTheHole')
  return user
}).then(console.log, console.log)
  .finally(() => db.close())
