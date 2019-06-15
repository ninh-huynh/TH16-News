var db = require('../utils/db');
var knex = db.queryBuilder;
const tableName = 'USER';

module.exports = {

    load: (totalRow, rowBegin, sortBy, order) => {
        var query = knex.queryBuilder()
            .select('u.*', 'ur.name as role', 'c.name as categoryManaged')
            .from('USER as u')
            .join('USER_ROLE as ur', 'u.roleID', '=', 'ur.id')
            .leftJoin('CATEGORY as c', 'u.categoryIdManaged', '=', 'c.id');
        
        if (sortBy !== undefined)
            query = query.orderBy(sortBy, order);
        
        query = query.limit(totalRow).offset(rowBegin);
        return query;
    },

    countTotal: () => {
        return knex.queryBuilder()
            .select(knex.raw('COUNT(*) as total'))
            .from('USER')
            .then(rows => {
                return rows[0].total;
            });
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

    removeAll: (userIDs) => {
        return db.removeAll(userIDs, tableName);
    },

    checkEmailExists: (email) => {
        return knex.queryBuilder().select().from(tableName).where('email', email)
            .then(rows => {
                return rows.length === 1;
            });
    },

    loadById: (id) => {
        return knex.queryBuilder()
            .select('u.*', 'ur.name as role')
            .from('USER as u')
            .join('USER_ROLE as ur', 'u.roleId', '=', 'ur.id')
            .where('u.id', '=', id)
            .then(rows => {
                if (rows.length === 0)
                    throw Error(`User id ${id} not found`);
                return rows[0];
            });
    },
};