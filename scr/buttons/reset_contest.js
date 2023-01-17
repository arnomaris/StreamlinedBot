const photocontestHandler = require('./../database/photocontestHandler.js')
const settingHandler = require('./../database/settingHandler.js')

module.exports = {
    data: {
        name: 'reset_contest'
    },
    async execute(interaction) {
        await interaction.deferReply(interaction.guild.id)
        photocontestHandler.clearEntries(interaction.guild.id)
        photocontestHandler.clearVotes(interaction.guild.id)

        let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
        let amountOfMessages = 1

        while (amountOfMessages > 0) {
            try {
                let messages = await photocontestChannel.bulkDelete(100, true)
                amountOfMessages = messages.length
            } catch(error) {
                interaction.editReply('I experienced an error while clearing #photo-contest\n```\n'+ error + '\n```' )
                break
            }
        }
        settingHandler.updateSetting('photocontest', false, interaction.guild.id)
        settingHandler.updateSetting('voting', false, interaction.guild.id)
        await interaction.editReply('Successfully cleared the photo contest, start a new one with `/managecontest open`')
    }
};