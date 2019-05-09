var mysql = require('mysql');

function createConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'th16_news'
    });
}

module.exports = {
    testConnection: () => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect((error) => {
                if (error)
                    reject(error);
                else
                    resolve('Connect to DB Server successfully!');
            });
            connection.end();
        });
    },
    
    load: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (err, results, fiels) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
            connection.end();
        });
    }
};