import * as connection from './connection.mjs'

export async function createTable(table, definition) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`CREATE TABLE IF NOT EXISTS ${table} (${definition})`, 
            function (err, result, fields) {
                if (err) {
                    reject(err) 
                    console.log(err) 
                }
                if (result[0])
                    resolve(result[0].value)
                else
                    resolve(null)
            }
        )
    })
}