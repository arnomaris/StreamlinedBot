import * as connection from './connection.mjs'
import * as tableUtil from './tableUtil.mjs'

const tableConfig = {
    name: 'strikes',
    definition: 'id INT AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), user VARCHAR(255), reason TEXT, date DATETIME'
}

/**
 * Add a strike to a user in a guild
 * @param {number} guild 
 * @param {string} user 
 * @param {string} reason 
 * @returns strike id
 */
export async function addStrike(guild, user, reason) {
    return tableUtil.createTable(tableConfig.name, tableConfig.definition).then(() => {
        return new Promise((resolve, reject) => {
            connection.pool.query(`INSERT INTO ${tableConfig.name} (guild, user, reason, date) VALUES('${guild}', '${user}', '${reason}', NOW())`, function (err, result, fields) {
                if (err) {
                    return reject(err) 
                } else {
                    resolve(result.insertId)
                }
            })
        })
    })
}

export async function getStrike(id, guild) {
    return tableUtil.createTable(tableConfig.name, tableConfig.definition).then(() => {
        return new Promise((resolve, reject) => {
            connection.pool.query(`SELECT user, reason, date FROM ${tableConfig.name}} WHERE id='${id}' AND guild='${guild}'`, function (err, result, fields) {
                if (err) {
                    return reject(err) 
                }
                if (result[0])
                    resolve(result[0].value)
                else
                    resolve(null)
            })
        })
    })
}

export async function getUserStrikes(user, guild) {
    return tableUtil.createTable(tableConfig.name, tableConfig.definition).then(() => {
        return new Promise((resolve, reject) => {
            connection.pool.query(`SELECT id, reason, date FROM ${tableConfig.name}} WHERE user='${user}' AND guild='${guild}'`, function (err, result, fields) {
                if (err) {
                    return reject(err) 
                }
                if (result[0])
                    resolve(result[0].value)
                else
                    resolve(null)
            })
        })
    })
}

export async function updateStrikeReason(id, guild, reason) {
    return tableUtil.createTable(tableConfig.name, tableConfig.definition).then(() => {
        return new Promise((resolve, reject) => {
            connection.pool.query(`UPDATE ${tableConfig.name}} SET reason='${reason}' WHERE id='${id}' AND guild='${guild}'`, function (err, result, fields) {
                if (err) {
                    return reject(err)
                } else {
                    resolve()
                }
            })
        })
    })
}