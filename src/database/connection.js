const mysql = require('mysql')
const { WebhookClient, EmbedBuilder } = require('discord.js')
require('dotenv').config();

const errorWebhook = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN})

exports.database

exports.connect = function() {
    module.exports.pool = mysql.createPool({
        connectionLimit : 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
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