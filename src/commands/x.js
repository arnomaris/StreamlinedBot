const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('x')
        .setDescription('Get the link to the X account'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('x'), ephemeral: false })
    }
};