module.exports = {
  // user model errors
  ERR_USERNAME_ILLEGAL: Symbol('username is illegal'),
  ERR_USERNAME_ALREADY_EXISTS: Symbol('username already exists'),
  ERR_USER_NOT_FOUND: Symbol('user not found'),
  ERR_WRONG_PASSWORD: Symbol('wrong password'),

  // database error
  ERR_DATABASE_ERROR: Symbol('database read/write error')
}
