var knex = require('knex')({
    client: 'mysql',
    version: '8.0',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    },
    pool: { min: 0, max: 10 },
    debug: false                 // set this value to true if you want to display all query
});

module.exports = {
    // Retrieving rows from the table
    // sql: query string

    // Ex: sql = 'SELECT * FROM category'
    load: sql => {
        return knex.raw(sql);
    },

    // Add an entity (js object) to the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    add: (entity, table) => {
        return knex.insert(entity).into(table);
    },

    // Update a row in the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    update: (entity, table) => {
        var id = entity.id;
        delete entity['id'];
        return knex(table).where('id', id).update(entity);
    },

    // Delete a row in the table name `table`
    // enitity: javascript object (the property name must be same as the table column name)
    // table: table name

    //Ex: entity = {name: 'cat1', id: 1, parentId: null}
    //    table = 'category'
    remove: (entity, table) => {
        var id = entity.id;
        return knex(table).where('id', id).del();
    },

    removeAll: (ids, table) => {
        return knex(table).whereIn('id', ids).del();
    },

    queryBuilder: knex
};