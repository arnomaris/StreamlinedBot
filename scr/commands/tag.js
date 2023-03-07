const { SlashCommandBuilder, SnowflakeUtil } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Apply tag to forum channel')
        .addStringOption(option =>
			option.setName('tag')
				.setDescription('The applied tag')
				.setRequired(true)
				.addChoices(
					{ name: 'Not tested', value: 'Not tested' },
					{ name: 'Testing', value: 'Testing' },
					{ name: 'Tested', value: 'Tested' },
					{ name: 'Broken', value: 'Broken' },
				)),
    async execute(interaction) {
        if (interaction.channel.isThread()) {
            const tag = interaction.options.getString('tag');
            interaction.channel.setAppliedTags([tag])
            interaction.reply({ content: "Applied tag!", ephemeral: true })
        } else {
            interaction.reply({ content: "This command does not work in this channel!", ephemeral: true })
        }
    }
};