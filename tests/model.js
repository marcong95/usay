let co = require('co')
let debug = require('debug')('usay:test')
let db = require('../models/db')
let User = require('../models/user')
let Post = require('../models/post')

require('../common/promise-extend')

co(function*() {
  // yield User.register('marco', 'LongLiveChina')
  // let user = yield User.login('marco', 'LongLiveChina')
  // let user yield user.modify('bio', 'modify tested at ' + new Date().toString())
  // yield User.login('marco', 'FireInTheHole')
  let reinhardt = yield User.login('reinhardt', 'HammerDown')
  // let post = yield Post.addPost(reinhardt, 'Hey, get behind me!')
  // console.log(post)
  let posts = yield User.getUsers({}, 1, 2)
  return posts.map((v) => v.username)
  // return posts
}).then((res) => {
    debug('resolved: ' + res)
  }, (err) => {
    debug('rejected: ' + err)
  })
  .finally(() => db.close())
