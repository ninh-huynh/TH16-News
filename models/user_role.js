var knex = require('../utils/db').queryBuilder;

module.exports = {
    getName: (id) => {
        return knex.queryBuilder()
            .select('name')
            .from('USER_ROLE')
            .where('id', '=', id)
            .then(rows => {
                return rows[0].name;
            });
    },

    load: () => {
        return knex.queryBuilder()
            .select()
            .from('USER_ROLE');  
    },

    getId: (name) => {
        return knex.queryBuilder()
            .select('id')
            .from('USER_ROLE')
            .where('name', '=', name)
            .then(rows => {
                return rows[0].id;
            });
    }
};