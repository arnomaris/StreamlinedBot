const { SlashCommandBuilder, SnowflakeUtil } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the link to the roadmap'),
    async execute(interaction) {
        let response = await interaction.reply({ content: "Pinging..", ephemeral: false })
		await interaction.editReply(`🏓**Pong!**\n**Latency**\n${SnowflakeUtil.deconstruct(response.id).timestamp - SnowflakeUtil.deconstruct(interaction.id).timestamp}ms\n**API**\n${Math.round(interaction.client.ws.ping)}ms`);
    }
};