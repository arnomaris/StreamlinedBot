const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Get the link to the reddit'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('reddit') })
    }
};