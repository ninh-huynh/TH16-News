var db = require('../utils/db');
var th16_news = require('../utils/th16_news');
var linkHelper = require('../utils/linkHelper');
var article = require('./articles');
var knex = db.queryBuilder;

var TAG = th16_news.TAG;
var ARTICLE_TAG = th16_news.ARTICLE_TAG;

module.exports = {
    //TODO: add pagination
    load: () => {
        return knex.queryBuilder().select().from('TAG');
    },

    loadByName: (name) => {
        return knex.queryBuilder().select().from('TAG').where('name', name)
            .then(rows => {
                if (rows.length === 0)
                    throw new Error(`Tag ${name} not found!`);
                return rows[0];
            });
    },

    loadByArticle: (id) => {
        var subQuery1 = knex.queryBuilder()
            .select('tagID')
            .from('ARTICLE_TAG')
            .where('articleID', id);
       
        return knex.queryBuilder()
            .select()
            .from('TAG')
            .whereIn('id', subQuery1);
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
        return knex('TAG').where('id', id).select();
    },

    add: (newTag) => {
        return db.add(newTag, 'TAG');
    },

    update: (tag) => {
        return db.update(tag, 'TAG');
    },

    remove: (tag) => {
        return db.remove(tag, 'TAG');
    },
};