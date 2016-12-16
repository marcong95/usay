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
  avatar: String,
  bio: String,
  created: Date,
  bantext: String,
  baned: Boolean,
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
        authority: 'admin',
        bantext:"#",
        baned: false,
        avatar: config.user.defaultAvatar,
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
      let ret = new User(user)
      return ret
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

User.getPostRanking = function(count = 10) {
  
}

User.getFollowedRanking = function(count = 10) {

}

User.getFavouriteRanking = function(count = 10) {

}

User._unifyId = function(user) {
  if (user instanceof User) {
    return user._id
  } else if (user === '') {
    return null
  } else if (typeof user === 'string' || user instanceof String) {
    return mongoose.Types.ObjectId(user)
  } else if (user instanceof Object && user._id) {
    return mongoose.Types.ObjectId(user._id)
  } else if (typeof user === 'undefined') {
    return undefined
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

User.prototype.favorite = function(postId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let subdoc = { to: postId, created: new Date }
      that.favourites.push(subdoc)
      that._model.favourites.push(subdoc)
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unfavorite = function(postId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let indexToDelete = that.favourites.findIndex(
        elmt => elmt.to == postId.toString())
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

User.prototype.getFavouritedCount = function() {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let favourites = that.favourites
      return favourites.length;
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getFavourited = function() {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let favourites = that.favourites.map((elmt) => elmt.to)
      let posts = yield Post.getPosts({ _id: { $in: favourites }})
      let postMap = new Map()   // post._id: post
      for (let p of posts) {
        postMap.set(p._id.toString(), p)
      }
      let ret = Array.from(that.favourites)
      for (let p of ret) {
        p.to = postMap.get(p.to.toString())
      }
      return ret
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.upvote = function(postId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let subdoc = { to: postId, created: new Date }
      that.upvoteds.push(subdoc)
      that._model.upvoteds.push(subdoc)
      yield that._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unupvote = function(postId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let indexToDelete = that.upvoteds.findIndex(
        elmt => elmt.to == postId.toString())
      debug(postId.toString(), indexToDelete)
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


User.prototype.follow = function(userId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let subdoc = { to: userId, created: new Date }
      that.followeds.push(subdoc)
      that._model.followeds.push(subdoc)
      yield that._model.save()
      
      let followedUser = yield User.getUserById(userId)
      let subdoc1 = { from: that._id, created: new Date }
      followedUser.followers.push(subdoc1)
      followedUser._model.followers.push(subdoc1)
      yield followedUser._model.save()
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.unfollow = function(userId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      // elmt: Object       elmt._id: String
      // userId: ObjectId   userId.toString(): String
      let followedToDelete = that.followeds.findIndex(
        elmt => elmt.to == userId.toString())
      if (followedToDelete >= 0) {
        that.followeds.splice(followedToDelete, 1)
        that._model.followeds.splice(followedToDelete, 1)
        yield that._model.save()
      }
      let followedUser = yield User.getUserById(userId)
      let followerToDelete = followedUser.followers.findIndex(
        elmt => elmt.from == that._id.toString())
      if (followerToDelete >= 0) {
        followedUser.followers.splice(followerToDelete, 1)
        followedUser._model.followers.splice(followerToDelete, 1)
        yield followedUser._model.save()
      }
      debug(followedToDelete, '===', followerToDelete)
      return that
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.followId = function(userId) {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      // elmt: Object       elmt._id: String
      // userId: ObjectId   userId.toString(): String
      let followedToDelete = that.followeds.findIndex(
        elmt => elmt.to == userId.toString())
      if (followedToDelete >= 0) {
         return true
      }else{
          return false
      }
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getFollowedCount = function() {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let followeds = that.followeds
      return followeds.length;
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getFollowed = function() {
  let that = this
  return new Promise((resolve, reject) => {
    co(function*() {
      let followeds = that.followeds.map((elmt) => elmt.to)
      let users = yield User.getUsers({ _id: { $in: followeds }})
      let userMap = new Map()   // post._id: post
      for (let p of users) {
        userMap.set(p._id.toString(), p)
      }
      let ret = Array.from(that.followeds)
      for (let p of ret) {
        p.to = userMap.get(p.to.toString())
      }
      return ret
    }).then(resolve, reject)
      .catch(reject)
  })
}

User.prototype.getFollowers = function() {
  return User.getUsers({ _id: { $in: this.followers }})
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

User.getPostRank = function() {
  
}

User.getFollowedRank = function() {

}

User.getFavouriteRank = function() {

}

User.prototype.toObject = function() {
  return this._model.toObject()
}

module.exports = User
