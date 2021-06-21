const connection = require('./connection.js')

exports.getSetting = function(key) {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT value FROM settings WHERE stringKey='${key}'`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
                console.log(err) 
            }
            resolve(result[0].value)
        })
    })
}

exports.updateSetting = function(key, value) {
    connection.database.query(`UPDATE settings SET value='${value}' WHERE stringKey='${key}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}