
const clientHandler = require('./../client.js')

module.exports = async function(message, isInteraction) {
    if (clientHandler.client.voice.connections.first()) {
        if (message.member.voice.channel && message.member.voice.channel.equals(clientHandler.client.voice.connections.first().channel)) {
            clientHandler.client.voice.connections.first().disconnect()
        } else {
            message.reply({content: "You are not in the same voice channel as me!", allowedMentions: { repliedUser: false }})
        }
    } else {
        message.reply({content: "I am not in a voice channel!", allowedMentions: { repliedUser: false }})
    }
}