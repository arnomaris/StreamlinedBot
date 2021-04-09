const channels = require('./channels.js')
const clientHandler = require('./client.js')
const commandHandler = require('./commands/commandHandler.js')
const commandUtil = require('./utility/commandUtil.js')

clientHandler.client.on('message', (message) => {
    if(message.author.bot) return

    if (message.channel.id == process.env.suggestions){
        message.react('👍')
            .then(message.react('👎'))
            .catch(console.error)
    } else if (message.channel.id == process.env.photoContest){
        if(!commandUtil.isAdmin(message) && !commandUtil.hasRole(message.member, 'Event Manager') && !commandUtil.hasRole(message.member, 'Moderator')){
            if (message.content == ''){
                let count = 0
                message.channel.messages.cache.forEach(m =>{
                    if (m.member == message.member) {
                        count += 1
                    }
                })
                if (count > 1){
                    message.delete()
                    commandUtil.sendErrorReply(message, 'Woops looks like you already posted a submission!')
                    commandUtil.sendLog('Deleted photo contest submission', message.author, 'Multiple submissions')
                }
            } else {
                message.delete()
                commandUtil.sendErrorReply(message, 'Woops looks like you added a caption to your submission!')
                commandUtil.sendLog('Deleted photo contest submission', message.author, 'Included caption')
            }
        }
    }

    if (message.content.startsWith(process.env.PREFIX)){
        commandHandler.handleCommand(message)
    }
})

clientHandler.client.on('raw', packet => {
    if (packet.t !== 'MESSAGE_UPDATE') return
    if (packet.d.channel_id == process.env.photoContest) {
        channels.photoContest.messages.fetch(packet.d.id).then(message => {
            if(!commandUtil.isAdmin(message) && !commandUtil.hasRole(message.member, "Event Manager") && !commandUtil.hasRole(message.member, "Moderator")) {
                message.delete()
                commandUtil.sendErrorReply(message, "Woops editing your messages is not allowed!")
                commandUtil.sendLog("Deleted photo contest submission", message.author, "Edited message")
            }
        })
    }
})