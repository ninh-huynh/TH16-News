var db = require('../utils/db');
const tableName = 'CATEGORY';

module.exports = {
    load: () => {
        return db.load(`SELECT * FROM ${tableName}`);
    },

    add: (newCategory) => {
        return db.add(newCategory, tableName);
    },

    update: (category) => {
        return db.update(category, tableName);
    },

    remove: (category) => {
        return db.remove(category, tableName);
    }
};