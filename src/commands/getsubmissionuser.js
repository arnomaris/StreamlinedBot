const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const photocontestHandler = require('./../database/photocontestHandler.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Get user')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const messageId = interaction.targetMessage.id
        let userId = await photocontestHandler.getEntry(messageId, interaction.guild.id).catch(err => {
            interaction.editReply('Experienced error while getting user')
        })
        if (userId)
            interaction.editReply(`Submission from <@${userId}>`)
        else
            interaction.editReply('This is not a valid messageid')
    }
}