import { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { getEntry } from '../database/photocontestHandler.mjs';

export const data = new ContextMenuCommandBuilder()
    .setName('Get user')
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const messageId = interaction.targetMessage.id;
    let userId = await getEntry(messageId, interaction.guild.id).catch(err => {
        interaction.editReply('Experienced error while getting user');
    });
    if (userId)
        interaction.editReply(`Submission from <@${userId}>`);

    else
        interaction.editReply('This is not a valid messageid');
}