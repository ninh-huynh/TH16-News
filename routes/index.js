var express = require('express');
var articles = require('../models/article');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    Promise.all([
        articles.loadWeeklyTrend(5, 0),
        articles.loadNewest(10, 0),
        articles.loadMostViewed(10, 0),
        articles.loadTopCategory(10, 0)])
        .then(([weeklyTrendRows, newestRows, mostViewedRows, topCatRows]) => {
            var obj = {
                articles: weeklyTrendRows,
                newestArticles: newestRows,
                mostViewedArticles: mostViewedRows,
                topCatArticles: topCatRows
            };
            res.render('index', obj);
        })
        .catch(next);
});

module.exports = router;
