var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/index', {
        title: 'Home',
        index: 'index',
        toSearch: true,
        user: req.session.user
    });
});

module.exports = router;
