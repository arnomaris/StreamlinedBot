const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('discord')
        .setDescription('Get the link to the discord'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('discord'), ephemeral: false })
    }
};