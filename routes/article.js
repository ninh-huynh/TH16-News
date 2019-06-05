var express = require('express');
var router = express.Router();
var articleModel = require('../models/articles');

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

module.exports = router;