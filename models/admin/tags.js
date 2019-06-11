var db = require('../../utils/db');
var knex = db.queryBuilder;
var linkHelper = require('../../utils/linkHelper');
const tableName = 'TAG';


module.exports = {
    load: (limit, offset, search, sort, order) => {
        return Promise.all([
            knex(tableName)
                .count('id as total')
                .first()
                .modify((queryBuilder) => {
                    if (search)
                        queryBuilder.whereRaw(`match(name) against('${search}')`);

                    if (sort && order)
                        queryBuilder.orderBy(sort, order);
                })
                .then(row => row.total),

            knex(tableName)
                .select('*')
                .modify((queryBuilder) => {
                    if (search !== null && search !== undefined && search !== '')
                        queryBuilder.whereRaw(`match(name) against('${search}')`);

                    if (sort && order)
                        queryBuilder.orderBy(sort, order);
                })
                .limit(limit)
                .offset(offset)
        ]);
    },

    add: (tag) => {
        return knex(tableName)
            .insert(tag)
            .then(rows => rows[0]);
    },

    remove: (ids) => {
        return knex(tableName)
            .whereIn('id', ids)
            .delete();
    },

    update: (tag) => {
        return knex(tableName)
            .where('id', tag.id)
            .update(tag);
    }
};