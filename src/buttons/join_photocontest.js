module.exports = {
    data: {
        name: 'join_photocontest'
    },
    async execute(interaction) {
        let photoContestRole = await interaction.guild.roles.cache.find(role => role.name === 'Photo Contest')
        if (!photoContestRole) {
            interaction.reply({content: 'An error occurred while giving you the role. Please try again or use #roles!', ephemeral: true})
        } else {
            await interaction.member.roles.add(photoContestRole, 'Join Photo Contest').catch(err => {
                interaction.reply({content: 'An error occurred while giving you the role. Please try again or use #roles!', ephemeral: true})
            })
            interaction.reply({ content: 'You are now participating in the photocontest!', ephemeral: true})
        }
    }
};