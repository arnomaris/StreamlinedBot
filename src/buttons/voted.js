const { MessageFlags } = require("discord.js");
const photocontestHandler = require('./../database/photocontestHandler.js')

module.exports = {
    data: {
        name: 'voted'
    },
    async execute(interaction) {
        let voteId = await photocontestHandler.getVote(interaction.user.id, interaction.guild.id)
        if (voteId) {
            let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
            interaction.reply({content: `You voted for: https://discord.com/channels/${interaction.guild.id}/${photocontestChannel.id}/${voteId}`, flags: MessageFlags.Ephemeral})
        } else {
            interaction.reply({content: 'You did not vote for anyone yet!', flags: MessageFlags.Ephemeral})
        }
    }
}