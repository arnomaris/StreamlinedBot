const clientHandler = require('./client.js')
const commandHandler = require('./commands/commandHandler.js')

clientHandler.client.on('messageCreate', (message) => {
    if(message.author.bot) return

    if (message.channel.id == process.env.suggestions){
        message.react('👍')
            .then(message.react('👎'))
            .catch(console.error)
    } else if (message.channel.name == 'creations'){
        if (message.attachments.size || message.embeds.length) {
            message.react('👍')
        } else {
            message.delete()
        }
    }

    if (message.content.startsWith(process.env.PREFIX)){
        commandHandler.handleCommand(message)
    }
})

clientHandler.client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    commandHandler.handleCommand(interaction)
});
