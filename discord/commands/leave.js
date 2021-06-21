
const clientHandler = require('./../client.js')

module.exports = async function(message, isInteraction) {
    if (clientHandler.client.voice.connections.first()) {
        if (message.member.voice.channel && message.member.voice.channel.equals(clientHandler.client.voice.connections.first().channel)) {
            clientHandler.client.voice.connections.first().disconnect()
        } else {
            message.lineReplyNoMention("You are not in the same voice channel as me!")
        }
    } else {
        message.lineReplyNoMention("I am not in a voice channel!")
    }
}