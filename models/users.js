var db = require('../utils/db');
var knex = db.queryBuilder;
const tableName = 'USER';

module.exports = {

    load: (totalRow, rowBegin) => {
        var query = knex.queryBuilder()
            .select('u.*', 'ur.name as role', 'c.name as categoryManaged')
            .from('USER as u')
            .join('USER_ROLE as ur', 'u.roleID', '=', 'ur.id')
            .leftJoin('CATEGORY as c', 'u.categoryIdManaged', '=', 'c.id')
            .limit(totalRow).offset(rowBegin);
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
};