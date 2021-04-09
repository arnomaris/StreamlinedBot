const connection = require('./connection.js')

exports.getValue = function(key) {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT value FROM settings WHERE stringKey='${key}'`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
                console.log(err) 
            }
            console.log("Got result", result[0].value)
            resolve(result[0].value)
        })
    })
}

exports.updateValue = function(key, value) {
    connection.database.query(`UPDATE settings SET value='${value}' WHERE stringKey='${key}"'`, function (err, result, fields) {
        if (err) {
            resolve(undefined) 
            console.log(err) 
        }
    })
}