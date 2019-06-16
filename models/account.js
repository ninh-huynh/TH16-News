var db = require('../utils/db');
var moment = require('moment');
var knex = db.queryBuilder;
const tableName = 'USER';

const sqlDateFormat = 'YYYY/MM/DD';

module.exports = {
    addReader: (newReader) => {
        knex('USER_ROLE as role')
            .select('role.id as id')
            .where('role.name', 'Độc giả')
            .then(row => {
                const roleID = row[0].id;
                newReader.roleID = roleID;
                newReader.dateOfBirth = moment(newReader.dateOfBirth, 'DD/MM/YYYY').format(sqlDateFormat);
                newReader.expiryDate = moment().format(sqlDateFormat);
                return knex(tableName)
                    .insert(newReader);
            })
            .catch(err => {
                console.log(err);
            });
    },

    addSingle: (user) => {
        return knex(tableName)
            .insert(user);
    },

    getSingleByEmail: (email) => {
        return knex(tableName)
            .where('email', email)
            .select('*');
    },

    getSingleByFacebookID: (id) => {
        return knex(tableName)
            .where('facebookID', id)
            .select('*');
    },

    getSingleByGoogleID: (id) => {
        return knex(tableName)
            .where('googleID', id)
            .select('*');
    },

    update: (user) => {
        return knex(tableName)
            .update(user)
            .where('id', user.id);
    }
};