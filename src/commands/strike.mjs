import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { addStrike } from '../database/strikeHandler.mjs';

export const data = new SlashCommandBuilder()
    .setName('strike')
    .setDescription('Give a member a strike')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('The reason for the strike')
            .setRequired(true))
    .addUserOption(option => option.setName('member').setDescription('Member'))

export async function execute(interaction) {
    console.log(interaction.options)
    const prom = interaction.deferReply();
    const member = interaction.options.getMember('member') ? interaction.options.getMember('member') : 
        interaction.channel.isThread() ? await interaction.channel.fetchOwner() : undefined; 

    await prom
    
    if (!member) {
        interaction.editReply({ content: 'Provide a member or use this command in a suggestion thread.', ephemeral: true })
        return
    }
    const reason = interaction.options.getString('reason');

    // Give the member a strike
    addStrike(interaction.guild.id, member.id, reason).then((strikeId) => {
        const botlogsChannel = interaction.guild.channels.cache.find(channel => channel.name === 'bot-logs')
        console.log(member)
        const embed = new EmbedBuilder()
            .setColor('#FF470F')
            .setTitle(`Suggestion strike (${strikeId}):`)
            .setAuthor({ name: member.user.username, iconUrl: member.avatarURL() })
            .setDescription(reason)
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
        botlogsChannel.send({ embeds: [embed] })

        interaction.editReply({ content: `Successfully gave ${member.user.username} a strike for: ${reason}`, ephemeral: true });
    }).catch((err) => {
        interaction.editReply({ content: 'An error occurred while giving the member a strike.', ephemeral: true });
        console.error(err);
    });
}
