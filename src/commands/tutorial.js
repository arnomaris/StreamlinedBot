const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Get the link to the tutorial'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('tutorial') })
    }
};