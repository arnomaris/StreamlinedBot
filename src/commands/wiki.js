const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Get the link to the wiki'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('wiki'), ephemeral: false })
    }
};