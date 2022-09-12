const connection = require('./connection.js')

exports.getEntry = function(messageid) {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT id FROM photocontest WHERE messageid='${messageid}'`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
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
    connection.database.query(`UPDATE photocontest SET id='${id}' WHERE messageid='${messageid}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getMessage = function(id) {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT messageid FROM photocontest WHERE id='${id}'`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
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
    connection.database.query(`UPDATE photocontest SET messageid='${messageid}' WHERE id='${id}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setMessage = function(id, messageid) {
    connection.database.query(`INSERT INTO photocontest VALUES(${id}, ${messageid})`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.deleteMessage = function(messageid) {
    return new Promise((resolve, reject) => {
        connection.database.query(`DELETE FROM photocontest WHERE messageid='${messageid}'`, function (err, result, fields) {
            if (err) {
                resolve(err) 
            } else {
                resolve(true)
            }
        })
    })
}

exports.deleteEntry = function(id) {
    connection.database.query(`DELETE FROM photocontest WHERE id='${id}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getEntries = function() {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT messageid, id FROM photocontest`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
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
    connection.database.query(`DELETE FROM photocontest`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.getVote = function(id) {
    return new Promise((resolve, reject) => {
        connection.database.query(`SELECT messageid FROM voted WHERE id='${id}'`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
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
        connection.database.query(`
        SELECT p.messageid, p.id, COUNT(v.id) AS votes 
        FROM voted AS v JOIN photocontest AS p ON v.messageid = p.messageID 
        GROUP BY p.messageid 
        ORDER BY COUNT(v.id) DESC`, function (err, result, fields) {
            if (err) {
                resolve(undefined) 
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
    connection.database.query(`UPDATE voted SET messageid='${messageid}' WHERE id='${id}'`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.setVote = function(id, messageid) {
    connection.database.query(`INSERT INTO voted VALUES(${id}, ${messageid})`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}

exports.clearVotes = function(id, messageid) {
    connection.database.query(`DELETE FROM voted`, function (err, result, fields) {
        if (err) {
            console.log(err) 
        }
    })
}