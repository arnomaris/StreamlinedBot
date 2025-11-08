const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const trello = require('trello')
const trelloClient = new trello(process.env.TRELLO_API_KEY, process.env.TRELLO_API_TOKEN)

const CARD_LIST_ID = process.env.TRELLO_DATA_ERASURE_LIST_ID // Trello list ID for data erasure requests, for now hardcoded

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adddataerasure')
        .setDescription('Add data erasure request for a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('userid').setDescription('Roblox User ID').setRequired(true)),
    async execute(interaction) {
        const userID = interaction.options.getInteger('userid')
        if (userID) {
            await interaction.deferReply()
            trelloClient.addCard(userID, '', CARD_LIST_ID).then(card => {
                interaction.editReply(`Created data erasure request for Roblox User ID ${userID}: https://trello.com/c/${card.shortLink}`)
            }).catch(err => {
                interaction.editReply('There was an error creating the data erasure request.')
                console.log(err)
            })
        } else {
            interaction.reply('You must provide a valid Roblox User ID.')
        }
    }
};