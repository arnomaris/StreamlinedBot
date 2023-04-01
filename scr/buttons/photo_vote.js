const photocontestHandler = require('./../database/photocontestHandler.js')
const settingHandler = require('./../database/settingHandler.js')

module.exports = {
    data: {
        name: 'photo_vote'
    },
    async execute(interaction) {
        let votingOpen = await settingHandler.getSetting('voting', interaction.guild.id).catch(err => {
            interaction.reply({content: 'There was an error while registering your vote!', ephemeral: true})
        })
        if (votingOpen === 'true') {
            let userId = interaction.user.id
            let messageId = interaction.message.id
            if (!(await photocontestHandler.getEntry(messageId, interaction.guild.id) == userId)) {
                photocontestHandler.getVote(userId, interaction.guild.id).then(async (value) => {
                    if (value) {
                        photocontestHandler.updateVote(userId, messageId, interaction.guild.id)
                        await interaction.reply({content: 'Changed your vote successfully', ephemeral: true})
                    } else {
                        photocontestHandler.setVote(userId, messageId, interaction.guild.id)
                        await interaction.reply({content: 'Registered your vote', ephemeral: true})
                    }
                }).catch(err => {
                    interaction.reply({content: 'There was an error while registering your vote!', ephemeral: true})
                })
            } else {
                interaction.reply({content: 'You can not vote for yourself!', ephemeral: true})
            }
        } else {
            interaction.reply({content: 'Voting is closed!', ephemeral: true})
        }
    }
};