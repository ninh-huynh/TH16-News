var express = require('express');
var router = express.Router();
var linkHelper = require('../utils/linkHelper');

var newPostRouter = require('./writer/new-post');
var myPostsRouter = require('./writer/my-posts');

router.use((req, res, next) => {
    var user;
    if (typeof req.session.passport !== 'undefined')
        user = req.session.passport.user;
    
    if (typeof user === 'undefined' || typeof user.roleID === 'undefined' || user.roleID !== 2)
        res.status(400).send('Bạn không có quyền truy cập vào trang này');
    else
        next();
});

router.use('/new-post', newPostRouter);
router.use('/my-posts', myPostsRouter);

module.exports = router;