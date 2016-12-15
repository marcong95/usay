let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
var session = require('express-session')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let ejs = require('ejs')
let router = require('./tools/router')

// logging setup
let fs = require('fs')
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs')
  console.log('dir logs made')
}
let accessLogFile = fs.createWriteStream('./logs/access.log', { flags: 'a' })
let errorLogFile = fs.createWriteStream('./logs/error.log', { flags: 'a' })  

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session setup
app.use(session({
  secret: 'USAYSession',
  name: 'name',
  cookie: {maxAge: 30*60000},
  resave: false,
  saveUninitialized: true
}))

// read userpages.json
try {
  app.locals.Upage = require('./configs/userpages') 
} catch (e) {
  console.error('failed to read ./configs/userpages.json')
  console.error(e)
}

// register logger
app.use(logger('dev', {stream: accessLogFile}))

// register routes
let defaultRoutes = '/user'
let routes = './routes'
app.use('/', require(routes + defaultRoutes + '/index'))

let fileList = router.init(routes).getList()
for (let file of fileList) {
  app.use(file, require(routes + file))
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  if (req.header('X-Requested-With') === 'XMLHttpRequest') {
    // an ajax request, response with JSON
    res.render('error', function(err, html) {
      res.send({
        msg: res.locals.message,
        html: html
      })
    })
  } else {
    // a synchorized request, render the error page
    console.log(err)
    res.render('error')
  }
  
  // log stacktrace when production
  if (req.app.get('env') === 'development') {
    let meta = '[' + new Date() + ']' + req.url + '\n'
    errorLogFile.write(meta + err.stack + '\n')
  }
})

module.exports = app
