var db = require('../utils/db');
var linkHelper = require('../utils/linkHelper');
var knex = db.queryBuilder;
var th16_news = require('../utils/th16_news');
var COMMENT = th16_news.COMMENT;
var article = require('./articles');

module.exports = {
    //TODO: add pagination
    loadByArticle: (id) => {
        return knex.queryBuilder().select().from('COMMENT').where('articleID', id);
        
    },

    loadByArticleLink: (link) => {
        return article.load()
            .then(rows => {
                rows.forEach(row => {
                    var inputArticle;
                    rows.forEach(row => {
                        if ('/'.concat(link).concat('/') === linkHelper.concatToLink(row.title))
                            inputArticle = row;
                    });

                    return knex(COMMENT._).where(COMMENT.articleID, inputArticle.id).select();
                });
            });
    },

    add: (newComment) => {
        return db.add(newComment, COMMENT._);
    },
};