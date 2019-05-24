var db = require('../utils/db');
const tableName = 'TAG';

module.exports = {
    //TODO: add pagination
    load: () => {
        return db.load(`
        SELECT t.*
        FROM ${tableName} AS t`);
    },

    loadByArticle: (id) => {
        return db.load(`
        SELECT  t.*
        FROM (article_tag AS at
        JOIN ${tableName} AS t ON at.tagID = t.id) 
        WHERE articleID = ${id}
        `);
    },

    add: (newTag) => {
        return db.add(newTag, tableName);
    },

    update: (tag) => {
        return db.update(tag, tableName);
    },

    remove: (tag) => {
        return db.remove(tag, tableName);
    },
};