var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/c_post', {
        title: 'Post Collection',
        index: 'c_post',
        toSearch: true,
        user: req.session.user
    });
});

module.exports = router;
