var express = require('express');
var crypto = require('crypto');
var User = require("../../models/user");
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('user/login', {
        title: 'Login',
        index: 'login',
        user: req.session.user
    });
});

module.exports = router;
