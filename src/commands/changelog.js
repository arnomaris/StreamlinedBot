const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Get the link to the changelog'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('changelog'), ephemeral: false })
    }
};