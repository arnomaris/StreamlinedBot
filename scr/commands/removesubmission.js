const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');
const deletesubmission = require('../photocontest/deletesubmission.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Remove submission')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    async execute(interaction) {
        deletesubmission.execute(interaction)
    }
}