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

  favourite: function*() {
    let user = yield User.login('lucio', 'DropTheBeat')
    let post = yield Post.getPostById('58451e3cfee2c81fd099ae68')
    yield user.favourite(post)
    debug('after favouriting:')
    debug(user)
    yield user.unfavourite(post)
    return user
  },

  getFavouritePosts: function*() {
    let user = yield User.login('lucio', 'DropTheBeat')
    return yield user.getFavouritePosts()
  },

  upvote: function*() {
    let user = yield User.login('lucio', 'DropTheBeat')
    let post = yield Post.getPostById('58451e3cfee2c81fd099ae68')
    yield user.upvote(post)
    debug('after upvoting:')
    debug(user)
    yield user.unupvote(post)
    return user
  },

  follow: function*() {
    let lucio = yield User.login('lucio', 'DropTheBeat')
    let reinhardt = (yield User.getUsers({username: 'reinhardt'}))[0]
    yield lucio.follow(reinhardt)
    debug(lucio)
    reinhardt = yield User.getUsers({username: 'reinhardt'})  // fetch again
    debug(reinhardt)
    return {}
  },

  unfollow: function*() {
    let lucio = yield User.login('lucio', 'DropTheBeat')
    let reinhardt = (yield User.getUsers({username: 'reinhardt'}))[0]
    yield lucio.unfollow(reinhardt)
    debug(lucio)
    reinhardt = yield User.getUsers({username: 'reinhardt'})  // fetch again
    debug(reinhardt)
    return {}
  },

  getUserInfo: function*() {
    let user = (yield User.getUsers({username: 'reinhardt' }))[0]
    user.posts = yield user.getPosts()
    return user
  },

  getUsers: function*() {
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
  },
  
  addComment: function*() {
    let lucio = yield User.login('lucio', 'DropTheBeat')
    // The code below uses destructing assignments
    let [reinhardt] = yield User.getUsers({ username: 'reinhardt' })
    let [post] = yield Post.getPosts({ poster: reinhardt._id }, 0, 1)
    return yield post.addComment('Roger that.', lucio, reinhardt)
  },
  
  removeComment: function*() {
    let post = yield Post.getPostById('584c46fd3f47d7045490e696')
    debug(post)
    return yield post.removeComment('584c472e3f47d7045490e698')
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
