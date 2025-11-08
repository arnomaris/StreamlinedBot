const { MessageFlags } = require("discord.js");
const photocontestHandler = require('./../database/photocontestHandler.js')

module.exports = {
    data: {
        name: 'remove_vote'
    },
    async execute(interaction) {
        let voteId = await photocontestHandler.getVote(interaction.user.id, interaction.guild.id)
        if (voteId) {
            photocontestHandler.deleteVote(interaction.user.id, voteId, interaction.guild.id)
            interaction.reply({ content: 'Successfully deleted your vote', flags: MessageFlags.Ephemeral})
        } else {
            interaction.reply({content: 'You did not vote for anyone yet!', flags: MessageFlags.Ephemeral})
        }
    }
}