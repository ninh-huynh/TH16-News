var express = require('express');
var router = express.Router();
var linkHelper = require('../utils/linkHelper');

var newPostRouter = require('./writer/new-post');

router.use('/new-post', newPostRouter);

module.exports = router;