const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkunverified')
        .setDescription('Adds the unverified role to all members that are not verified')
	    .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const unverifiedRole = interaction.guild.roles.cache.find(role => role.name === 'Unverified');
        if (!unverifiedRole) {
            return interaction.reply({ content: 'Unverified role not found.', flags: MessageFlags.Ephemeral });
        }

        const verifiedRole = interaction.guild.roles.cache.find(role => role.name === 'Verified');
        if (!verifiedRole) {
            return interaction.reply({ content: 'Verified role not found.', flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply()
        await interaction.guild.members.fetch()
        const members = interaction.guild.members.cache;
        const newUnverifiedMembers = members.filter(member => !member.roles.cache.has(verifiedRole.id) && !member.roles.cache.has(unverifiedRole.id) && !member.user.bot);
        console.log(`Found ${newUnverifiedMembers.size} unverified members.`);

        if (newUnverifiedMembers.size === 0) {
            return interaction.editReply({ content: 'All members are verified.' });
        }

        const successCount = [];
        for (const member of newUnverifiedMembers.values()) {
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