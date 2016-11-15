var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/post_view', {
        title: 'Home',
        index: 'post',
        toBack: true,
        user: req.session.user
    });
});

module.exports = router;
