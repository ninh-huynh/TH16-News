var express = require('express');
var articleModel = require('../models/articles');
var router = express.Router();
var tags = require('../models/tags');

const articlePerPage = 5;       // define favorite number here.
var totalArticle;               // get from database
var totalPage;                  // calculate later


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

    articleModel.countTotalByTitle(keyword)
        .then(total => {
            totalArticle = total;
            totalPage = Math.floor(totalArticle / articlePerPage);

            if (totalArticle % articlePerPage != 0) { totalPage++; }

            var page = {
                current: current,
                total: totalPage,
                next: current + 1,
                prev: current - 1
            };

            if (current === 1) { page.prev = 0; }
            if (current === totalPage) { page.next = 0; }
        
            articleModel.searchByTitle(keyword, articlePerPage, (current - 1) * articlePerPage)
                .then(rows => {
                    var obj = {
                        keyword: keyword,
                        articles: rows,
                        page: page,
                    };
                    res.render('search', obj);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
