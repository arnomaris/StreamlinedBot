const mysql = require('mysql')
const { WebhookClient, EmbedBuilder } = require('discord.js')
require('dotenv').config();

const errorWebhook = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})

exports.database

exports.connect = function() {
    module.exports.pool = mysql.createPool({
        connectionLimit : 10,
        host: "us-cdbr-east-02.cleardb.com",
        user: 'b35ca20de2bb61',
        password: 'a33a92b7',
        database: 'heroku_1b35163b61f8186'
    })

    module.exports.pool.on('error', function onError(err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.log('Protocol connection lost')
        } else {
            const embed = new EmbedBuilder()
                .setColor('#FF470F')
                .setTitle(err.code)
                .setDescription(err.sql)
                .setTimestamp()
                .setFooter('Is fatal error: ' + err.fatal)
            errorWebhook.send({embeds: [embed]})
        }
    })
}