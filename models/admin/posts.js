var db = require('../../utils/db');
var knex = db.queryBuilder;
var linkHelper = require('../../utils/linkHelper');
const tableName = 'ARTICLE';

module.exports = {
    load: (limit, offset, search, sort, order) => {
        const query = knex.queryBuilder()
            .from(`${tableName} as art`)
            .innerJoin('USER as user', 'art.writerID', 'user.id')
            .innerJoin('CATEGORY as cat', 'art.categoryID', 'cat.id')
            .innerJoin('ARTICLE_STATUS as stat', 'art.statusID', 'stat.id')
            .modify((queryBuilder) => {
                if (search !== null && search !== undefined && search !== '')
                    queryBuilder
                        .whereRaw(`match(art.title) against('${search}')`)
                        .orWhereRaw(`match(user.name) against('${ search }')`)
                        .orWhereRaw(`match(cat.name) against('${ search }')`);
            });

        return Promise.all([
            // get total
            query
                .clone()
                .count('art.id as total')
                .first()
                .then(row => row.total),

            // get 1 page data
            query
                .clone()
                .select('art.id as id', 'art.title as title', 'user.name as author', 'cat.name as category', 'art.publicationDate as publish_date', 'stat.name as status')
                .modify(queryBuilder => {
                    if (sort && order)
                        queryBuilder.orderBy(sort, order);
                })
                .limit(limit)
                .offset(offset)
        ]);
    },

    updateStatus: (id, newStatus) => {
        knex('ARTICLE_STATUS as as')
            .select('as.id as id')
            .where('as.name', newStatus)
            .then(row => {
                let statusID = row[0].id;
                return knex(tableName)
                    .where('id', id)
                    .update('statusID', statusID);
            });
    },

    remove: (ids) => {
        return knex(tableName)
            .whereIn('id', ids)
            .delete();
    }
};