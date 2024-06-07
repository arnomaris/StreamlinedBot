const deletesubmission = require('../photocontest/deletesubmission.js');

module.exports = {
    data: {
        name: 'photo_reject'
    },
    async execute(interaction) {
        const mentions = interaction.message.mentions.users
        const user = mentions.first()

        deletesubmission.execute(interaction, messageID).then((response) => {
            interaction.message.edit({ content: `<@${user.id}>'s submission has been rejected by \`${interaction.user.username}\` with reason ${reason}`, components: [] })
        })
    }
};