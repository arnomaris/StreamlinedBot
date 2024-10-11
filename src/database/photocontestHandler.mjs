
import { WebhookClient } from 'discord.js';
import { pool } from './connection.mjs';
import 'dotenv/config';

const webhookClient = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})

export function getEntry(messageid, guild) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id FROM photocontest WHERE messageid='${messageid}' AND guild='${guild}'`, function (err, result, fields) {
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

export function updateEntry(messageid, id, guild) {
    pool.query(`UPDATE photocontest SET id='${id}' WHERE messageid='${messageid}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function getMessage(id, guild) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT messageid FROM photocontest WHERE id='${id}' AND guild='${guild}'`, function (err, result) {
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

export function updateMessage(id, messageid, guild) {
    pool.query(`UPDATE photocontest SET messageid='${messageid}' WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function setMessage(id, messageid, guild) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO photocontest VALUES(${id}, ${messageid}, ${guild})`, function (err) {
            if (err) {
                reject(err) 
                console.log(err) 
            } else
                resolve(null)
        })
    })
}

export function deleteMessage(messageid, guild) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM photocontest WHERE messageid='${messageid}' AND guild='${guild}'`, function (err) {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(true)
            }
        })
    })
}

export function deleteEntry(id, guild) {
    pool.query(`DELETE FROM photocontest WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function getEntries(guild) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT messageid, id FROM photocontest WHERE guild='${guild}'`, function (err, result) {
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

export function clearEntries(guild) {
    pool.query(`DELETE FROM photocontest WHERE guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function getVote(id, guild) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT messageid FROM voted WHERE id='${id}' AND guild='${guild}'`, function (err, result, fields) {
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

export function getVotes(guild) {
    return new Promise((resolve, reject) => {
        pool.query(`
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

export function updateVote(id, messageid, guild) {
    pool.query(`UPDATE voted SET messageid='${messageid}' WHERE id='${id}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function setVote(id, messageid, guild) {
    pool.query(`INSERT INTO voted VALUES(${id}, ${messageid}, ${guild})`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function deleteVote(id, messageid, guild) {
    pool.query(`DELETE FROM voted WHERE id='${id}' AND messageid='${messageid}' AND guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}

export function clearVotes(guild) {
    pool.query(`DELETE FROM voted WHERE guild='${guild}'`, function (err) {
        if (err) {
            console.log(err) 
        }
    })
}