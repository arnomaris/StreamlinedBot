const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insta')
        .setDescription('Get the link to the instagram'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('insta'), ephemeral: false })
    }
};