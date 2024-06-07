
const { WebhookClient } = require('discord.js')
const connection = require('./connection.js')
require('dotenv').config();

const webhookClient = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})

exports.getEntry = function(messageid, guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT id FROM photocontest WHERE messageid='${messageid}' AND guild='${guild}'`, function (err, result, fields) {
            if (err) {
                reject(err)
                console.log(err)
            }
            if (result[0])
                resolve(result[0].id)
            else
                resolve(null)
        })
    })
}

exports.updateEntry = function(messageid, id, guild) {
    connection.pool.query(`UPDATE photocontest SET id='${id}' WHERE messageid='${messageid}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getMessage = function(id, guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid FROM photocontest WHERE id='${id}' AND guild='${guild}'`, function (err, result) {
            if (err) {
                reject(err) 
                console.log(err) 
            }
            if (result[0])
                resolve(result[0].messageid)
            else
                resolve(null)
        })
    })
}

exports.updateMessage = function(id, messageid, guild) {
    connection.pool.query(`UPDATE photocontest SET messageid='${messageid}' WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setMessage = function(id, messageid, guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`INSERT INTO photocontest VALUES(${id}, ${messageid}, ${guild})`, function (err) {
            if (err) {
                reject(err) 
                console.log(err) 
            } else
                resolve(null)
        })
    })
}

exports.deleteMessage = function(messageid, guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`DELETE FROM photocontest WHERE messageid='${messageid}' AND guild='${guild}'`, function (err) {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(true)
            }
        })
    })
}

exports.deleteEntry = function(id, guild) {
    connection.pool.query(`DELETE FROM photocontest WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getEntries = function(guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid, id FROM photocontest WHERE guild='${guild}'`, function (err, result) {
            if (err) {
                reject(err)
                console.log(err)
            }
            if (result)
                resolve(result)
            else
                resolve(null)
        })
    })
}

exports.clearEntries = function(guild) {
    connection.pool.query(`DELETE FROM photocontest WHERE guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getVote = function(id, guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid FROM voted WHERE id='${id}' AND guild='${guild}'`, function (err, result, fields) {
            if (err) {
                reject(err)
                console.log(err)
            }
            if (result[0])
                resolve(result[0].messageid)
            else
                resolve(null)
        })
    })
}

exports.getVotes = function(guild) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`
        SELECT p.messageid, p.id, COUNT(v.id) AS votes 
        FROM voted AS v RIGHT OUTER JOIN photocontest AS p ON v.messageid = p.messageID
        WHERE p.guild='${guild}'
        GROUP BY p.messageid 
        ORDER BY COUNT(v.id) DESC`, function (err, result, fields) {
            if (err) {
                reject(err)
                console.log(err)
            }
            if (result)
                resolve(result)
            else
                resolve(null)
        })
    })
}

exports.updateVote = function(id, messageid, guild) {
    connection.pool.query(`UPDATE voted SET messageid='${messageid}' WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setVote = function(id, messageid, guild) {
    connection.pool.query(`INSERT INTO voted VALUES(${id}, ${messageid}, ${guild})`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.deleteVote = function(id, messageid, guild) {
    connection.pool.query(`DELETE FROM voted WHERE id='${id}' AND messageid='${messageid}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.clearVotes = function(guild) {
    connection.pool.query(`DELETE FROM voted WHERE guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}