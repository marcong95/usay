const co = require('co')
const debug = require('debug')('usay:test')
const db = require('../models/db')
const User = require('../models/user')
const Post = require('../models/post')

require('../common/promise-extend')

let scripts = {
  reg: function*() {
    yield User.register('marco', 'LongLiveChina')
    return yield User.login('mraco', 'LongLiveChina')
  },
  modify: function*() {
    let user = yield User.login('marco', 'LongLiveChina')
    return yield user.modify('bio', 'modify tested at ' + new Date().toString())
  },
  getUsers: function* () {
    return yield User.getUsers({}, {}, 1, 2)
  },
  post: function*() {
    let user = yield User.login('reinhardt', 'HammerDown')
    return yield Post.addPost(user, 'Hey, get behind me!')
  },
  getPostById: function*() {
    let post = yield Post.getPostById('58451e3cfee2c81fd099ae68')
    debug(Object.getPrototypeOf(post._id))
    return post
  },
  getPosts: function*() {
    let user = yield User.login('reinhardt', 'HammerDown')
    return yield Post.getPosts({ poster: user._id })
  }
}


co(function*() {
  if (process.argv.length > 2) {
    let scriptName = process.argv[2]
    if (scripts[scriptName] == null) {
      console.error('Script not found.')
    } else if (scripts[scriptName].constructor.name === 'GeneratorFunction') {
      return yield* scripts[scriptName]()
    } else {
      return yield scripts[scriptName]()
    }
  } else {
    return Promise.reject('Please provide the script name to run as the ' + 
      'first argument of this script.')
  }
}).then((res) => {
    debug('resolved: ')
    debug(res)
  }, (err) => {
    debug('rejected: ')
    debug(err)
  })
  .finally(function() {
    db.close()
  })
