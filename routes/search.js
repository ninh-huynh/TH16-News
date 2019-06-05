var express = require('express');
var articleModel = require('../models/articles');
var router = express.Router();
var tags = require('../models/tags');
var paginator = require('../utils/paginator');

const articlePerPage = 5;       // define favorite number here.

/* GET home page. */
router.get('/', function (req, res, next) {
    var keyword = req.query.keyword;

    var current;
    if (req.query.page === undefined) {
        current = 1;            // default page is page number 1
    }
    else {
        current = parseInt(req.query.page);
        if (current === undefined)
            next(new Error('404 not found'));
    }

    var page;
    articleModel.countTotalByTitle(keyword)
        .then(totalArticle => {
            page = paginator.get(current, totalArticle, articlePerPage);
            return articleModel.searchByKeyword(keyword, articlePerPage, (current - 1) * articlePerPage);
        })
        .then(rows => {
            var obj = {
                keyword: keyword,
                articles: rows,
                page: page,
            };
            res.render('search', obj);
        })
        .catch(next);
});

module.exports = router;
