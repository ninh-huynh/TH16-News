var express = require('express');
var articles = require('../models/article');
var router = express.Router();
var tags = require('../models/tags');

/* GET home page. */
router.get('/', function (req, res, next) {
    Promise.all([
        articles.loadWeeklyTrend(5, 0),
        articles.loadNewest(10, 0),
        articles.loadMostViewed(10, 0),
        articles.loadTopCategory(10, 0),
        tags.load()])
        .then(([weeklyTrendRows, newestRows, mostViewedRows, topCatRows, tagRows]) => {
            var obj = {
                articles: weeklyTrendRows,
                newestArticles: newestRows,
                mostViewedArticles: mostViewedRows,
                topCatArticles: topCatRows,
                tags: tagRows
            };
            res.render('index', obj);
        })
        .catch(next);
});

module.exports = router;
