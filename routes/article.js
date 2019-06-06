var express = require('express');
var router = express.Router();
var articleModel = require('../models/articles');
var commentModel = require('../models/comments');
var articleViewsModel = require('../models/article_views');
var moment = require('moment');


router.get('/:title', (req, res, next) => {
    var title = req.params.title;
    var articleEntity;
    var today = moment().format('YYYY-MM-DD');

    title = title.replace(/-/g, ' ');
    articleModel.searchByTitle(title)
        .then(article => {
            articleEntity = article;
            var pLoadBySameCategory = articleModel.loadBySameCategory(articleEntity);
            var pIncreaseViews = articleViewsModel.increaseView(article, today);
            return Promise.all([pLoadBySameCategory, pIncreaseViews]);
        })
        .then(([rows, totalRowEffected]) => {
            var obj = {
                article: articleEntity,
                sameCategoryArticle: rows
            };
            res.render('post', obj);
        })
        .catch(next);
});

router.post('/:title/comment', (req, res, next) => {
    var title = req.body.articleTitle;
    title = title.replace(/-/g, ' ');
    
    articleModel.searchByTitle(title)
        .then(article => {
            delete req.body.articleTitle;
            req.body.articleID = article.id;
            return commentModel.add(req.body);
        })
        .then(insertedRow => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;