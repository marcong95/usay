module.exports = {
  // Database connections
  db: {
    url: 'mongodb://localhost/usay'
  },
  user: {
    usernameRule: {regexp: /\w{4,20}/u, msg: '用户名长度必须为4~20个字符'},
    passwordRule: {regexp: /\w{6,20}/, msg: '密码长度必须为6~20个字符'},
    defaultAvatar: '/common/images/picture/test2.jpg'
  }
}
