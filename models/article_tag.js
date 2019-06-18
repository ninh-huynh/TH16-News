var db = require('../utils/db');
var knex = db.queryBuilder;
const tableName = 'ARTICLE_TAG';

module.exports = {
    add: (article_tag) => {
        return knex(tableName)
            .insert(article_tag);
    },

    getTagIDByArticleID: (articleID) => {
        return knex
            .queryBuilder()
            .from(`${ tableName } as at`)
            .innerJoin('TAG as t', 'at.tagID', 't.id')
            .where('at.articleID', articleID)
            .select('t.id as id', 't.name as name');
    },

    insertSingleEntity: (entity) => {
        return knex(tableName)
            .insert(entity);
    }
};