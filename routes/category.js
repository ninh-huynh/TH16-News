var express = require('express');
var route = express.Router();
var article = require('../models/articles');
var categories = require('../models/categories');

route.get('/:name', (req, res, next) => {
    var categoryName = req.params.name;
    var categoryPath = '/categories/' + categoryName;
    
    Promise.all([categories.loadByLink(categoryPath),
        article.loadByCategoryLink(categoryPath)])
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