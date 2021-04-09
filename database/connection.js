
const mysql = require('mysql')

exports.database

exports.connect = function() {
    module.exports.database = mysql.createConnection({
        host: "us-cdbr-east-02.cleardb.com",
        user: 'b35ca20de2bb61',
        password: 'a33a92b7',
        database: 'heroku_1b35163b61f8186'
    })

    module.exports.database.connect( function onConnect(err) {
        if (err) {
            console.log('error when connecting to db:', err)
            setTimeout(module.exports.connect, 10000)
        }
        console.log("Connected!")
    })

    module.exports.database.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            module.exports.connect();
        } else {
            throw err;
        }
    })
}
