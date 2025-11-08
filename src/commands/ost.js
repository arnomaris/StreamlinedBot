const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ost')
        .setDescription('Get the link to the ost'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('ost') })
    }
};