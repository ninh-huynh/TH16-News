var db = require('../utils/db');
const tableName = 'USER';

module.exports = {
    //TODO: add pagination
    load: () => {
        return db.load(`SELECT u.* FROM ${tableName} as u`);
    },

    add: (newUser) => {
        return db.add(newUser, tableName);
    },

    update: (user) => {
        return db.update(user, tableName);
    },

    remove: (user) => {
        return db.remove(user, tableName);
    },
};