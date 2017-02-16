module.exports = {
  // Database connections
  // Remember to set username and passoword for DB authentication
  db: {
    url: 'mongodb://localhost:27017',
    options: {
      db: 'usay',
      user: null,
      pass: null
    }
  },
  user: {
    usernameRule: {regexp: /\w{4,20}/u, msg: '用户名长度必须为4~20个字符'},
    passwordRule: {regexp: /\w{6,20}/, msg: '密码长度必须为6~20个字符'},
    defaultAvatar: '/common/images/avator/user2-160x160.jpg'
  }
}
