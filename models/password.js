let hash = require('crypto-js/sha3')
let base64 = require('crypto-js/enc-base64')

module.exports = {
  getSalt: function(factor = new Date().getTime()) {
    return hash(factor.toString()).toString(base64)
  },
  encrypt: function(password, salt) {
    return base64.stringify(hash(hash(password) + salt))
  }
}
