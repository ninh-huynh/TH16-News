var express = require('express');
var router = express.Router();
var articleModel = require('../models/articles');
var commentModel = require('../models/comments');

router.get('/:title', (req, res, next) => {
    var title = req.params.title;
    var articleEntity;

    title = title.replace(/-/g, ' ');
    articleModel.searchByTitle(title)
        .then(article => {
            articleEntity = article;
            return articleModel.loadBySameCategory(articleEntity);
        })
        .then(rows => {
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