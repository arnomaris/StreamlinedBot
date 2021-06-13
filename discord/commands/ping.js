const Discord = require('discord.js')

const clientHandler = require('./../client.js')

module.exports = function(message, isInteraction) {
    if (isInteraction) {
        clientHandler.client.api.interactions(message.id, message.token).callback.post({
            data: {
                type: 5,
            }
        }).then(() => {
            clientHandler.client.api.webhooks(clientHandler.client.user.id, message.token).messages('@original').get().then(m => {
                clientHandler.client.api.webhooks(clientHandler.client.user.id, message.token).messages('@original').patch({
                    data: {
                        content: `🏓**Pong!**\n**Latency**\n${Discord.SnowflakeUtil.deconstruct(m.id).timestamp - Discord.SnowflakeUtil.deconstruct(message.id).timestamp}ms\n**API**\n${Math.round(clientHandler.client.ws.ping)}ms`
                    }
                })
            })
        })
    } else {
        message.lineReplyNoMention('Pinging...').then(m => {
            m.edit(`🏓**Pong!**\n**Latency**\n${m.createdTimestamp - message.createdTimestamp}ms\n**API**\n${Math.round(clientHandler.client.ws.ping)}ms`)
        })
    }
}