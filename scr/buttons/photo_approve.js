module.exports = {
    data: {
        name: 'photo_approve'
    },
    async execute(interaction) {
        const mentions = interaction.message.mentions.users
        const user = mentions.first()
        interaction.message.edit({ content: `<@${user.id}>'s submission has been approved by \`${interaction.user.username}\`!`, components: [] })
    }
};