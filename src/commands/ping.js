const { SlashCommandBuilder, SnowflakeUtil } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('See the latency of the bot'),
    async execute(interaction) {
        let response = await interaction.reply({ content: "Pinging.." , fetchReply: true })
		await interaction.editReply(`🏓**Pong!**\n**Latency**\n${response.createdTimestamp  - interaction.createdTimestamp}ms\n**API**\n${Math.round(interaction.client.ws.ping)}ms`);
    }
};