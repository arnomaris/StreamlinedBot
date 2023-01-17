const photocontestHandler = require('./../database/photocontestHandler.js')

module.exports = {
    data: {
        name: 'voted'
    },
    async execute(interaction) {
        let voteId = await photocontestHandler.getVote(interaction.user.id, interaction.guild.id)
        if (voteId) {
            let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
            interaction.reply(`You voted for: https://discord.com/channels/${interaction.guild.id}/${photocontestChannel.id}/${voteId}`)
        } else {
            interaction.reply('You did not vote for anyone yet!')
        }
    }
}