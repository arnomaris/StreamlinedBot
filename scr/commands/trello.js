const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trello')
        .setDescription('Get the link to the roadmap'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('roadmap'), ephemeral: false })
    }
};