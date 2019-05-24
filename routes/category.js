var express = require('express');
var route = express.Router();
var article = require('../models/article');
var category = require('../models/category');

route.get('/:name', (req, res, next) => {

    Promise.all([category.loadByLink(req.params.name),
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