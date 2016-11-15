var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.user = null;
    res.render('user/login', {
        title: 'Login',
        user: req.session.user
    });
});

module.exports = router;
