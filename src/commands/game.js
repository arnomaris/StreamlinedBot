const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Get the link to the game'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('game') })
    }
};