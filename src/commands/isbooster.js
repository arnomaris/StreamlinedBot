const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('isbooster')
        .setDescription('Get nitro status of member')
        .addUserOption(option => option.setName('member').setDescription('Member')),
    async execute(interaction) {
        const member = interaction.options.getMember('member') ?? interaction.member
        if (member.premiumSince) {
            interaction.reply(`${member.displayName} has been boosting since ${member.premiumSince.toLocaleDateString("nl-NL")}`)
        } else {
            interaction.reply(`${member.displayName} is not a booster <:doggosad:610744652781322251>`)
        }
    }
};