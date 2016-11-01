var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = require('./tools/router.js');

//日志功能
var fs = require('fs');
var accessLogfile = fs.createWriteStream('./logs/access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('./logs/error.log', {flags: 'a'});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//会话功能
app.use(session({
  secret: '12345',
  name: 'name',
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: true,
}));

app.use(logger('dev'));
app.use(logger('dev', {stream: accessLogfile}));

var default_routes = "/user";

var routes = './routes';
//系统默认访问路径
app.use('/', require(routes + default_routes + '/index'));

console.log('/', routes + default_routes + '/index');
//自动添加访问路径
var fileList = router.init(routes).getList(); //获取文件夹routes下的文件列表，形式如：/XXX/XXX
for(var i in fileList){
  console.log(fileList[i],"  ",routes + fileList[i]);
  app.use(fileList[i], require(routes + fileList[i]));
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
    var meta = '[' + new Date() + ']' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
});

module.exports = app;
