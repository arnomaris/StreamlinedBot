const commandUtil = require('./../utility/commandUtil.js')
const fs = require('fs');
const { getVoiceConnection } = require('@discordjs/voice');

const clientHandler = require('./../client.js')

const helpInfo = {
    command: 'play',
    description: 'play the streamlined ost',
    fields: [
        {name: "Sub commands:", 
        value: `ost - play the original ost
        christmas - play the christmas ost
        `}
    ]
}

const validSongs = {
    ost: true,
    christmas: true
}

let dispatcher

module.exports = async function(message, isInteraction) {
    let args = isInteraction && message || message.content.split(/[ ]+/)
    if (args[1] && validSongs[args[1]]) {
        if (!clientHandler.client.voice.connections.first()) {
            if (message.member.voice.channel) {
                const connection = await message.member.voice.channel.join()
                dispatcher = connection.play(fs.createReadStream(`./files/music/${args[1]}.webm`), {volume: 1, type: 'webm/opus'})
                dispatcher.on('finish', () => connection.disconnect())
            } else {
                message.reply({content: "You need to join a voice channel first!", allowedMentions: { repliedUser: false }})
            }
        } else {
            message.reply({content: "I am already playing music!", allowedMentions: { repliedUser: false }})
        }
    } else {
        await commandUtil.help(message, helpInfo)
    }
}