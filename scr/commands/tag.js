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
            const tagName = interaction.options.getString('tag');
            const tagId = interaction.channel.parent.availableTags.find(tag => tag.name === tagName).id
            interaction.channel.setAppliedTags([tagId])
            interaction.channel.send({ content: `Tag: ${tagName} applied by user ${interaction.user.username}` })
            interaction.reply({ content: "Applied tag!", ephemeral: true })
        } else {
            interaction.reply({ content: "This command does not work in this channel!", ephemeral: true })
        }
    }
};