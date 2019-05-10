var db = require('../utils/db');

module.exports = {
    load: () => {
        return db.load('SELECT * FROM category');
    }

    //TODO: implement add, update, delete below
};