var db = require('../utils/db');
const tableName = 'COMMENT';

module.exports = {
    //TODO: add pagination
    loadByArticle: (id) => {
        return db.load(`
            SELECT c.*
            FROM ${tableName} AS c
            WHERE c.articleID = ${id}
        `);
    },

    add: (newComment) => {
        return db.add(newComment, tableName);
    },
};