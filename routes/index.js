var express = require('express');
var articles = require('../models/articles');
var router = express.Router();
var tags = require('../models/tags');

/* GET home page. */
router.get('/', function (req, res, next) {
    Promise.all([
        articles.loadWeeklyTrend(5, 0),
        articles.loadNewest(10, 0),
        articles.loadMostViewed(10, 0),
        articles.loadTopCategory(9, 0),
        tags.loadByTopPostCount(15)])
        .then(([weeklyTrendRows, newestRows, mostViewedRows, topCatRows, tagRows]) => {
            var obj = {
                trendArticles: weeklyTrendRows,
                newestArticles: newestRows,
                mostViewedArticles: mostViewedRows,
                topCatArticles: topCatRows,
                tags: tagRows,
                isHome: true
            };
            res.render('index', obj);
        })
        .catch(next);
});


module.exports = router;
