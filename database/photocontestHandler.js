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

exports.deleteEntry = function(id) {
    connection.database.query(`DELETE FROM photocontest WHERE id='${id}'`, function (err, result, fields) {
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