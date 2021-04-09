const connection = require('./connection.js')

connection.connect()

exports.getValue  = function(key) {
    return new Promise((resolve, reject) => {
        connection.database.query("SELECT value FROM settings where stringKey='" + key + "'", function (err, result, fields) {
            if (err) {
                resolve(undefined) 
                console.log(err) 
            }
            console.log("Got result", result[0].value);
            resolve(result[0].value)
        })
    })
}