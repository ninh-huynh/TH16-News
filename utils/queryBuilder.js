var db = require('./db');

var knex = require('knex')({
    client: 'mysql',
    version: '8.0',
    connection: db.connectionInfo,
    pool: { min: 0, max: 10 },
    debug: false                // set this value to true if you want to display all query
});



module.exports = knex;