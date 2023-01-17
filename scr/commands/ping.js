const { SlashCommandBuilder, SnowflakeUtil } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the link to the roadmap'),
    async execute(interaction) {
        let response = await interaction.reply({ content: "Pinging..", ephemeral: false , fetchReply: true })
		await interaction.editReply(`🏓**Pong!**\n**Latency**\n${response.createdTimestamp  - interaction.createdTimestamp}ms\n**API**\n${Math.round(interaction.client.ws.ping)}ms`);
    }
};