var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/user_view', {
        title: 'Post Collection',
        index: 'user_view',
        toBack: true,
        toSearch: true,
        user: req.session.user
    });
});

module.exports = router;
