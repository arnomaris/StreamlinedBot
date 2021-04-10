const clientHandler = require('./../client.js')

module.exports = function(message) {
    message.channel.send('Pinging...').then(m => {
        m.edit(`🏓**Pong!**\n**Latency**\n${m.createdTimestamp - message.createdTimestamp}ms\n**API**\n${Math.round(clientHandler.client.ws.ping)}ms`)
    })
}