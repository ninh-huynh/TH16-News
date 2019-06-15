var express = require('express');
var route = express.Router();
var article = require('../models/articles');
var categories = require('../models/categories');
var paginator = require('../utils/paginator');

const articlePerPage = 5;       // define favorite number here.

route.get('/:name', (req, res, next) => {
    var categoryName = req.params.name;
    var categoryPath = '/categories/' + categoryName;
    
    var isSubscriber = false;

    var current;
    if (req.query.page === undefined) {
        current = 1;            // default page is page number 1
    }
    else {
        current = parseInt(req.query.page);
        if (current === undefined)
            next(new Error('404 not found'));
    }
    
    var category;
    var page;
    categories.loadByLink(categoryPath)
        .then(categoryEntity => {
            category = categoryEntity;
            return article.countTotalByCategory(category);
        })
        .then(totalArticle => {
            page = paginator.get(current, totalArticle, articlePerPage);
            return article.loadByCategoryEntity(category,
                articlePerPage, (current - 1) * articlePerPage, isSubscriber);
        })
        .then(articles => {
            var obj = {
                articles: articles,
                category,
                page: page
            };
            res.render('category', obj);
        })
        .catch(next);
});

module.exports = route;