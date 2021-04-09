const clientHandler = require('./client.js')
const commandUtil = require('./utility/commandUtil.js')
const guilds = require('./guilds.js')

clientHandler.client.on('messageReactionAdd', async (messageReaction, user) => {
	if (messageReaction.partial) {
        try {
			await messageReaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error)
			return
		}
    }
    if(user.bot) return // If the user who reacted is a bot, return
    if (messageReaction.message.id === process.env.suggestionRulesMessage){
        const member = guilds.streamlinedGuild.members.cache.get(user.id)
        if (!member.roles.cache.get(process.env.suggestionBanRole)){
            member.roles.add(guilds.streamlinedGuild.roles.cache.get(process.env.suggestionRole))
        } else {
            try {
                messageReaction.users.remove(user.id)
            } catch (error) {
                console.error('Failed to remove reactions.')
            }
        }
    }
    if (messageReaction.message.channel.id == process.env.photoContest){
        if (messageReaction.message.author.id == user.id){
            messageReaction.users.remove(user.id)
        } else {
            commandUtil.getAmountOfReactions(photoContestChannel, user)
            .then(count => {
                if (count > 1){
                    messageReaction.users.remove(user.id)
                }
            })
        }
    }
})

clientHandler.client.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction.message.channel.id === process.env.suggestionRules){
        guilds.streamlinedGuild.members.cache.get(user.id).roles.remove(guilds.streamlinedGuild.roles.cache.get(process.env.suggestionRole))
    }
});