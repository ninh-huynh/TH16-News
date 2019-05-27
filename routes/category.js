var express = require('express');
var route = express.Router();
var article = require('../models/articles');
var categories = require('../models/categories');

const articlePerPage = 5;       // define favorite number here.
var totalArticle;               // get from database
var totalPage;                  // calculate later

route.get('/:name', (req, res, next) => {
    var categoryName = req.params.name;
    var categoryPath = '/categories/' + categoryName;

    var current;
    if (req.query.page === undefined) {
        current = 1;            // default page is page number 1
    }
    else {
        current = parseInt(req.query.page);
        if (current === undefined)
            next(new Error('404 not found'));
    }

    article.countTotalByCategory_public(categoryPath)
        .then(total => {
            totalArticle = total;
            totalPage = totalArticle / articlePerPage;

            if (totalArticle % articlePerPage != 0) { totalPage++; }

            var page = {
                current: current,
                total: totalPage,
                next: current + 1,
                prev: current - 1
            };

            if (current === 1) { page.prev = 0; }
            else if (current === totalPage) { page.next = 0; }

            Promise.all([categories.loadByLink(categoryPath),
                article.loadByCategoryLink(categoryPath, articlePerPage, (current - 1) * articlePerPage)])
                .then(([categoryEntity, articles]) => {
                    var obj = {
                        articles: articles,
                        category: categoryEntity,
                        page: page
                    };
                    res.render('category', obj);
                })
                .catch(next);
        });
});

module.exports = route;