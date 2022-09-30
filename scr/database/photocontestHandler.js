
const { WebhookClient } = require('discord.js')
const connection = require('./connection.js')
require('dotenv').config();

const webhookClient = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})

exports.getEntry = function(messageid) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT id FROM photocontest WHERE messageid='${messageid}'`, function (err, result, fields) {
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

exports.updateEntry = function(messageid, id) {
    connection.pool.query(`UPDATE photocontest SET id='${id}' WHERE messageid='${messageid}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getMessage = function(id) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid FROM photocontest WHERE id='${id}'`, function (err, result) {
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

exports.updateMessage = function(id, messageid) {
    connection.pool.query(`UPDATE photocontest SET messageid='${messageid}' WHERE id='${id}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setMessage = function(id, messageid) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`INSERT INTO photocontest VALUES(${id}, ${messageid})`, function (err) {
            if (err) {
                reject(err) 
                console.log(err) 
            } else
                resolve(null)
        })
    })
}

exports.deleteMessage = function(messageid) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`DELETE FROM photocontest WHERE messageid='${messageid}'`, function (err) {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(true)
            }
        })
    })
}

exports.deleteEntry = function(id) {
    connection.pool.query(`DELETE FROM photocontest WHERE id='${id}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getEntries = function() {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid, id FROM photocontest`, function (err, result) {
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

exports.clearEntries = function(id, messageid) {
    connection.pool.query(`DELETE FROM photocontest`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getVote = function(id) {
    return new Promise((resolve, reject) => {
        connection.pool.query(`SELECT messageid FROM voted WHERE id='${id}'`, function (err, result, fields) {
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

exports.getVotes = function() {
    return new Promise((resolve, reject) => {
        connection.pool.query(`
        SELECT p.messageid, p.id, COUNT(v.id) AS votes 
        FROM voted AS v RIGHT OUTER JOIN photocontest AS p ON v.messageid = p.messageID 
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

exports.updateVote = function(id, messageid) {
    connection.pool.query(`UPDATE voted SET messageid='${messageid}' WHERE id='${id}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setVote = function(id, messageid) {
    connection.pool.query(`INSERT INTO voted VALUES(${id}, ${messageid})`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.clearVotes = function() {
    connection.pool.query(`DELETE FROM voted`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}