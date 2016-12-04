let debug = require('debug')('usay:database')
let co = require('co')
let db = require('../models/db')
let User = require('../models/_user')
let password = require('../models/password')

// create
function create() {
  return new Promise((resolve, reject) => {
    let marco = new User({
      username: 'marco',
      authority: 'user',
      salt: password.getSalt(),
      nickname: '__marco__',
      bio: 'Struggling to be a qualified programmer...',
      created: new Date()
    })
    marco.password = password.encrypt('LongLiveChina')
    // console.log(marco)
    marco.save().then(function(user) {
      debug('document inserted')
      resolve()
    }, function(err) {
      debug('error occured when creating: ' + err)
      reject()
    })
  })
}

// retrieve
function retrieve() {
  return new Promise((resolve, reject) => {
    User.find({ username: 'marco' }).exec().then(function(users) {
      debug(users.length + ' retrieved' +  
        (users.length > 1 ? ', which nicknames are ' : ', which nickname is ') + 
        (users.length > 0 ? Array.from(users).map(x => x.nickname).reduce(
        (acc, cur) => (acc + ', ' + cur)) : ''))
      resolve(users)
    }, function(err) {
      debug('error occured when retrieving: ' + err)
      reject()
    })
  })
}

// retrieve using Model.prototype.findOne
function retrieveOne() {
  return new Promise((resolve, reject) => {
    User.findOne({ username: 'marco' }).exec().then(function(user) {
      debug('document retrieved, which nickname is ' + user.nickname)
      resolve(user)
    }, function(err) {
      debug('error occured when retrieving: ' + err)
      reject()
    })
  })
}

// update
function update() {
  return new Promise((resolve, reject) => {
    User.update({ username: 'marco' }, { lastOnline: new Date() }, 
      function(err) {
        if (err) {
          debug('error occured when updating: ' + err)
          reject(err)
        } else {
          debug('document updated')
          resolve()
        }
      })
  })
}

// delete
function remove() {
  return new Promise((resolve, reject) => {
    User.remove({ username: 'marco' }, function(err) {
      if (err) {
        debug('error occured when removing: ' + err)
        reject(err)
      } else {
        debug('document removed')
        resolve()
      }
    })
  })
}

// add a finally method to Promise
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}

// start calling
co(function*() {
  yield create()
  yield retrieve()
  let roRes = yield retrieveOne()
  console.log(roRes)
  yield update()
  yield remove()
}).then(function() {
  debug('test finished')
}, function(err) {
  debug('error occured: ' + err)
}).catch(function(ex) {
  debug('exception caught: ' + ex)
}).finally(function() {
  db.close()
})
