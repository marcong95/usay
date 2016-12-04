let mongoose = require('mongoose')
let co = require('co')
let debug = require('debug')('usay:database')
let config = require('../config')
let CONST = require('./constants')
let db = require('./db')
let pwd = require('./password')

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  authority: String,
  salt: String,
  nickname: String,
  avatar: {
    url: String
  },
  bio: String,
  created: Date,
  lastOnline: Date,
  favourites: [{
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created: Date
  }],
  upvoteds: [{
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: Date
  }]
})

let UserModel = mongoose.model('User', userSchema)

let User = function() {}

User.checkUsername = function(username) {
  return new Promise((resolve, reject) => {
    if (!username.match(config.user.usernameRule)) {
      reject(CONST.ERR_USERNAME_ILLEGAL)
    } else {
      UserModel.find({ username }).exec().then(function(users) {
        if (users.length == 0) {
          resolve()
        } else {
          reject(CONST.ERR_USERNAME_ALREADY_EXISTS)
        }
      }, () => reject(DATABASE_ERROR, ...arguments))
    }
  })
}

User.register = function(username, password) {
  return new Promise((resolve, reject) => {
    co(function*() {
      yield User.checkUsername(username)
      let salt = pwd.getSalt()
      let user = new UserModel({
        username,
        password: pwd.encrypt(password, salt),
        authority: 'user',
        salt,
        created: new Date()
      })
      yield user.save()
      resolve(wrapUserObject.call(user))
    }).then(resolve, reject)
  })
}

User.login = function(username, password) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let user = yield UserModel.findOne({ username }).exec() 
      if (!user) {
        reject(CONST.ERR_USER_NOT_FOUND)
      } else if (pwd.encrypt(password, user.salt) !== user.password) {
        reject(CONST.ERR_WRONG_PASSWORD)
      } else {
        user.lastOnline = new Date()
        yield user.save()
        resolve(wrapUserObject.call(user))
      }
    }).then(resolve, reject)
  })
}

function wrapUserObject() {
  let ret = this.toObject()

  ret._model = this

  ret.modify = function(key, value) {
    if (key == 'password') {
      value = pwd.encrypt(value, this.salt)
    }

    let that = this
    return new Promise((resolve, reject) => {
      co(function*() {
        that._model[key] = value
        yield that._model.save()
        that[key] = value
        resolve(that)
      }).then(resolve, reject)
    })
  }

  return ret
}

module.exports = User
