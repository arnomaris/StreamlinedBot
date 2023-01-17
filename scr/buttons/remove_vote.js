const photocontestHandler = require('./../database/photocontestHandler.js')

module.exports = {
    data: {
        name: 'remove_vote'
    },
    async execute(interaction) {
        let voteId = await photocontestHandler.getVote(interaction.user.id, interaction.guild.id)
        if (voteId) {
            photocontestHandler.deleteVote(interaction.user.id, voteId, interaction.guild.id)
            interaction.reply('Successfully deleted your vote')
        } else {
            interaction.reply('You did not vote for anyone yet!')
        }
    }
}