var mysql = require('mysql');
var connectionInfo = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

//TODO: Change the user name and password for specific role (guest, admin, ...)
var pool = mysql.createPool({
    connectionLimit: 10,
    host: connectionInfo.host,
    user: connectionInfo.user,
    password: connectionInfo.password,
    database: connectionInfo.database
});

module.exports = {

    connectionInfo,
    // For testing purpose only, will remove it from the future
    testConnection: () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err)
                    reject(err);
                else {
                    resolve('Connect to DB Server successfully!');
                    connection.release();
                }
            });
        });
    },

    // Retrieving rows from the table
    // sql: query string

    // Ex: sql = 'SELECT * FROM category'
    load: sql => {
        return new Promise((resolve, reject) => {
            // var pool = createPool();
            pool.query(sql, (err, results, fields) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
    },

    // Add an entity (js object) to the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    add: (entity, table) => {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO ${table} SET ? `, entity, (err, results, fields) => {
                if (err)
                    reject(err);
                else
                    resolve(results.insertId);
            });
        });
    },

    // Update a row in the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    update: (entity, table) => {
        return new Promise((resolve, reject) => {
            var id = entity.id;
            delete entity['id'];
            pool.query(`UPDATE ${table} SET ? WHERE id = ? `, [entity, id], (err, results, fields) => {
                if (err)
                    reject(err);
                else
                    resolve(results.changedRows);
            });
        });
    },

    // Delete a row in the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    remove: (entity, table) => {
        return new Promise((resolve, reject) => {
            var id = entity.id;
            pool.query(`DELETE FROM ${table} WHERE id = ${id} `, (err, results, fields) => {
                if (err)
                    reject(err);
                else
                    resolve(results.affectedRows);
            });
        });
    }
};