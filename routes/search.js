var express = require('express');
var articles = require('../models/articles');
var router = express.Router();
var tags = require('../models/tags');

/* GET home page. */
router.get('/', function (req, res, next) {
    var keyword = req.query.keyword;
    var articles = [];
    var obj = {
        keyword: keyword,
        articles: articles
    };
    res.render('search', obj);
});

module.exports = router;
