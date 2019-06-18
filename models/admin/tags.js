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

    // thêm tag nếu chưa tồn tại, trả về của tag mới thêm hoặc đã trùng
    insertIfNotExists: (tag) => {
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

    insertTagNameifNotExists: (tagName) => {
        return knex(tableName)
            .select('*')
            .where('name', tagName)
            .then(rows => {
                if (rows.length === 1)
                    return rows[0].id;
                else {
                    return knex(tableName)
                        .insert({ name: tagName })
                        .then(rows => {
                            console.log(rows);
                            return rows[0];
                        });
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