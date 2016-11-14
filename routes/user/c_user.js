var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/c_user', {
        title: 'User Collection',
        index: 'c_user',
        user: req.session.user
    });
});

module.exports = router;
