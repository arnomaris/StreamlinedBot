const { SlashCommandBuilder } = require('discord.js');
const randomMessage = require('./../utility/randomMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('merch')
        .setDescription('Get the link to the merch shop'),
    async execute(interaction) {

        await interaction.reply({ content: randomMessage.getMessage('merch'), ephemeral: false })
    }
};