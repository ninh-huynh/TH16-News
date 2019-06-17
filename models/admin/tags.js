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
            .then(rows => {
                console.log(rows);
            });
    },

    upsert: (tag)=> {
        //const {table, object, constraint} = params;
        const insert = knex('CATEGORY').insert(tag);
        const update = knex.queryBuilder().update(tag);
        return knex.raw(`? ON CONFLICT ${ 'name' } DO ? returning *`, [insert, update]).get('rows').get(0);
    },

    insertIfNotExists: (tag) => {
        // return db.load(`
        //     insert into TAG(name)
        //     select '${ tag.name }'
        //     where not exists (select * from TAG where name = '${ tag.name }')
        // `);

        return knex(tableName)
            .select('*')
            .where('name', tag.name)
            .then(rows => {
                if (rows.length === 1)
                    return rows[0].id;
                else {
                    return knex(tableName)
                        .insert(tag)
                        .then(rows => rows[0]);
                }
            });
    },

    insertMultiple: (tags) => {
        return Promise.all([
            tags.forEach(tag => {
                return knex(tableName)
                    .select('*')
                    .where('name', tag.name)
                    .then(rows => {
                        if (rows.length === 1)
                            return rows[0].id;
                        else {
                            return knex(tableName)
                                .insert(tag)
                                .then(rows => rows[0]);
                        }
                    });
            })
        ]);
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