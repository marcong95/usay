var express = require('express');
var router = express.Router();

router.get("/*", function(req, res, next) {
    if(!req.session.user){
        res.redirect("/user/login?url=" + encodeURI(req.baseUrl));
        return;
    }
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/c_user', {
        title: 'User Collection',
        index: 'c_user',
        toSearch: true,
        user: req.session.user
    });
});

module.exports = router;
