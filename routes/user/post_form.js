var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/post_form', {
        title: 'Post edit',
        index: 'post_form',
        toBack: true,
        toUploadFile: true,
        user: req.session.user
    });
});

module.exports = router;
