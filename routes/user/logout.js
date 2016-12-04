var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.user = null;
<<<<<<< HEAD
    res.render('user/login', {
        title: 'Login',
        index: 'login',
        user: req.session.user
    });
=======
    res.redirect('/user/login');
>>>>>>> refs/remotes/origin/pr/1
});

module.exports = router;
