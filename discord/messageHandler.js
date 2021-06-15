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
    }

    if (message.content.startsWith(process.env.PREFIX)){
        commandHandler.handleCommand(message)
    }
})

clientHandler.client.ws.on('INTERACTION_CREATE', async interaction => {
    if (interaction.type == '2') {
        commandHandler.handleCommand(interaction)
    }
});
