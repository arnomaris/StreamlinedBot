const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js');

module.exports = {
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('deletion_reason')
            .setPlaceholder('Select a reason')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Lights')
                    .setDescription('Train lights are not on')
                    .setValue('lights'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Theme')
                    .setDescription('Not following this weeks theme')
                    .setValue('theme'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Rules')
                    .setDescription('Not following the rules')
                    .setValue('rules'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Edited')
                    .setDescription('Submission is edited')
                    .setValue('edited'),
            );

        const row = new ActionRowBuilder()
        .addComponents(select);

		return await interaction.reply({
			content: 'Select a reason for deletion',
			components: [row],
            flags: MessageFlags.Ephemeral 
		});
    },
}