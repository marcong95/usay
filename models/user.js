const co = require('co')
const debug = require('debug')('usay:database')
const mongoose = require('mongoose')
const config = require('../configs/global')
const CONST = require('./constants')
const db = require('./db')
const pwd = require('./password')
const Post = require('./post')

const userSchema = mongoose.Schema({
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
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created: Date
  }],
  followeds: [{
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: Date
  }],
  followers: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: Date
  }]
})

const UserModel = mongoose.model('User', userSchema)

let User = function(model) {
  let modelObj = model.toObject()
  for (let prop in modelObj) {
    this[prop] = modelObj[prop]
  }
  this._model = model
}

User.checkUsername = function(username) {
  return new Promise((resolve, reject) => {
    if (!username.match(config.user.usernameRule.regexp)) {
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
      if (!password.match(config.user.passwordRule.regexp)) {
        reject(CONST.ERR_PASSWORD_ILLEGAL)
      } 
      let salt = pwd.getSalt()
      let user = new UserModel({
        username,
        password: pwd.encrypt(password, salt),
        authority: 'user',
        salt,
        created: new Date()
      })
      yield user.save()
      return new User(user)
    }).then(resolve, reject)
      .catch(reject)
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
      }
      return new User(user)
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.getUserById = function(userId) {
  return new Promise((resolve, reject) => {
    co(function*() {
      let user = yield UserModel.findById(userId).exec()
      return new User(user)
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.getUsers = function(condition, projection, skip, limit, pure) {
  // db.users.find({}).skip(skip).limit(count)
  return new Promise((resolve, reject) => {
    co(function*() {
      let query = UserModel.find(condition, projection)
      skip && query.skip(skip)
      limit && query.limit(limit)
      let users = yield query.exec()
      if (pure) {
        return users.map((user) => user.toObject())
      } else {
        return users.map((user) => new User(user))
      }
    }).then(resolve, reject)
      .catch(reject)
  })
}

User._unifyId = function(user) {
  if (user instanceof User) {
    return user._id
  } else if (user instanceof String) {
    return mongoose.Types.ObjectId(user)
  } else if (user instanceof Object && user._id) {
    return mongoose.Types.Objectid(user._id)
  } else {
    debug(user instanceof User)
    throw new Error("Cannot cast from " + user.constructor.name + 
      " to ObjectId")
  }
}

// favourites, upvoted, followeds, followers

User.prototype.getPosts = function() {
  return Post.getPosts( { poster: this._id } )
}

User.prototype.favourite = function(post) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let postId = Post._unifyId(post)
      that.favourites.push(postId)
      that._model.favourites.push(postId)
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unfavourite = function(post) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let postId = Post._unifyId(post)
      let indexToDelete = that.favourites.findIndex(elmt => elmt == postId)
      if (indexToDelete >= 0) {
        that.favourites.splice(indexToDelete, 1)
        that._model.favourites.splice(indexToDelete, 1)
      }
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getFavouritePosts = function() {
  return Post.getPosts({ _id: { $in: this.favourites }})
}

User.prototype.upvote = function(post) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let postId = Post._unifyId(post)
      that.upvoteds.push(postId)
      that._model.upvoteds.push(postId)
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unupvote = function(post) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let postId = Post._unifyId(post)
      let indexToDelete = that.upvoteds.findIndex(elmt => elmt == postId)
      if (indexToDelete >= 0) {
        that.upvoteds.splice(indexToDelete, 1)
        that._model.upvoteds.splice(indexToDelete, 1)
      }
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getUpvotedPosts = function() {
  return Post.getPosts({ _id: { $in: this.upvoteds }})
}

User.prototype.follow = function(user) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let userId = User._unifyId(user)
      that.followeds.push(userId)
      that._model.followeds.push(userId)
      yield that._model.save()
      let followedUser = yield User.getUserById(userId)
      followedUser.followers.push(that._id)
      followedUser._model.followers.push(that._id)
      yield followedUser._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unfollow = function(user) {

}

User.prototype.getFollowedUsers = function() {
  return Post.getPosts({ _id: { $in: this.followeds }})
}

User.prototype.getFollowers = function() {
  return Post.getPosts({ _id: { $in: this.followers }})
}


User.prototype.modify = function(key, value) {
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
      .catch(reject)
  })
}

User.prototype.toObject = function() {
  return this._model.toObject()
}

module.exports = User
