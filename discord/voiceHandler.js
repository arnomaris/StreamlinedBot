const channels = require('./channels.js')
const clientHandler = require('./client.js')
const commandHandler = require('./commands/commandHandler.js')
const commandUtil = require('./utility/commandUtil.js')


clientHandler.client.on('voiceStateUpdate', (_, newState) => {
    if (newState.channelID){
        channels.micChannel.updateOverwrite(newState.member.user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
        })
    } else if (!newState.channelID){
        try {
            channels.micChannel.permissionOverwrites.get(newState.member.user.id).delete()
        } catch (error) {
            console.log(error)
        }
    }
})