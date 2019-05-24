var db = require('../utils/db');
var th16_news = require('../utils/th16_news');
var linkHelper = require('../utils/linkHelper');
var article = require('../models/article');
var knex = require('../utils/queryBuilder');

var TAG = th16_news.TAG;
var ARTICLE_TAG = th16_news.ARTICLE_TAG;

module.exports = {
    //TODO: add pagination
    load: () => {
        return db.load(`
        SELECT t.*
        FROM ${TAG._} AS t`);
    },

    loadByLink: (link) => {
        return knex(TAG._).select()
            .then(rows => {
                var tag;
                rows.forEach(row => {
                    if (linkHelper.concatToLink([row.name]) ===
                        '/'.concat(link).concat('/')) {
                        tag = row;
                    }
                });
                if (tag === undefined)
                    throw new Error(`tags/${link} not found!`);

                return tag;
            });
    },

    loadByArticle: (id) => {
        return db.load(`
        SELECT  t.*
        FROM (article_tag AS at
        JOIN ${TAG._} AS t ON at.tagID = t.id) 
        WHERE articleID = ${id}
        `);
    },

    loadByArticleLink: (link) => {
        // Get article id first
        return article.load()
            .then(rows => {
                var inputArticle;
                rows.forEach(row => {
                    if ('/'.concat(link).concat('/') === linkHelper.concatToLink(row.title))
                        inputArticle = row;
                });

                return knex(TAG._).whereIn(TAG.id, () => {
                    knex(ARTICLE_TAG._).where(ARTICLE_TAG.articleID, inputArticle.id).select(ARTICLE_TAG.tagID);
                }).select();
            });
    },

    loadById: (id) => {
        return knex(TAG).where('id', id).select();
    },

    add: (newTag) => {
        return db.add(newTag, TAG);
    },

    update: (tag) => {
        return db.update(tag, TAG);
    },

    remove: (tag) => {
        return db.remove(tag, TAG);
    },
};