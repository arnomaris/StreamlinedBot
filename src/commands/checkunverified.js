const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, Collection, SnowflakeUtil } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkunverified')
        .setDescription('Adds the unverified role to all members that are not verified')
	    .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const unverifiedRole = interaction.guild.roles.cache.find(role => role.name === 'Unverified');
        if (!unverifiedRole) {
            return interaction.reply({ content: 'Unverified role not found.', ephemeral: true });
        }

        const verifiedRole = interaction.guild.roles.cache.find(role => role.name === 'Verified');
        if (!verifiedRole) {
            return interaction.reply({ content: 'Verified role not found.', ephemeral: true });
        }

        await interaction.deferReply()
        const members = await interaction.guild.members.cache
        const unverifiedMembers = members.filter(member => !member.roles.cache.has(verifiedRole.id));
        console.log(`Found ${unverifiedMembers.size} unverified members.`);

        if (unverifiedMembers.size === 0) {
            return interaction.editReply({ content: 'All members are verified.' });
        }

        const successCount = [];
        for (const member of unverifiedMembers.values()) {
            try {
                await member.roles.add(unverifiedRole);
                successCount.push(member.user.username);
            } catch (error) {
                console.log(`Failed to add role to ${member.user.username}:`, error);
            }
        }

        return interaction.editReply({ content: `Added Unverified role to ${successCount.length} members: \`${successCount.join(', ')}\``});
    }
}