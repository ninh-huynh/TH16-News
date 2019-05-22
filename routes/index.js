var express = require('express');
var articles = require('../models/article');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    Promise.all([
        articles.loadWeeklyTrend(5, 0),
        articles.loadNewest(10, 0)])
        .then(([weeklyTrendRows, newestRows]) => {
            var obj = {
                articles: weeklyTrendRows,
                newestArticles: newestRows
            };
            res.render('index', obj);
        })
        .catch(next);
});

module.exports = router;
