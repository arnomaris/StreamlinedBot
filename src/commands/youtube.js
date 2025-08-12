const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Get the link to the youtube channel'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('youtube'), ephemeral: false })
    }
};