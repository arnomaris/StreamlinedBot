const connection = require('./connection.js')

exports.getSetting = function(key) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT value FROM settings WHERE stringKey='${key}'`, function (err, result, fields) {
            if (err) {
                reject(err) 
                console.log(err) 
            }
            if (result[0])
                resolve(result[0].value)
            else
                resolve(null)
        })
    })
}

exports.updateSetting = function(key, value) {
    connection.pool.query(`UPDATE settings SET value='${value}' WHERE stringKey='${key}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}