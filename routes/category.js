var express = require('express');
var route = express.Router();
var article = require('../models/articles');
var categories = require('../models/categories');

route.get('/:name', (req, res, next) => {

    Promise.all([categories.loadByLink(req.params.name),
        article.loadByCategoryLink(req.params.name)])
        .then(([categoryEntity, articles]) => {
            var obj = {
                articles: articles,
                category: categoryEntity
            };
            res.render('category', obj);
        })
        .catch(next);
});

module.exports = route;