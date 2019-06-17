var db = require('../utils/db');
var knex = db.queryBuilder;
const tableName = 'ARTICLE_TAG';

module.exports = {
    add: (article_tag) => {
        return knex(tableName)
            .insert(article_tag);
    }
};