const connection = require('./connection.js')

exports.getSetting = (key, guild) => {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT value FROM settings WHERE stringKey='${key}' AND guild='${guild}'`, function (err, result, fields) {
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

exports.updateSetting = (key, guild, value) => {
    connection.pool.query(`UPDATE settings SET value='${value}' WHERE stringKey='${key}' AND guild='${guild}'`, function (err, result, fields) {
        if (err) {
            console.log(err)
        }
    })
}