const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const photocontestHandler = require('./../database/photocontestHandler.js')
const settingHandler = require('./../database/settingHandler.js')

const warningMessageContent = 'The photo contest is currently accepting submissions! Use `/photocontest submit` with your picture in #botcommands\nVoting is currently closed, wait until the announcement to vote!'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('managecontest')
        .setDescription('Manage the photo contest')
	    .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addSubcommand(subcommand =>
            subcommand
                .setName('getvotes')
                .setDescription('Get votes of the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Reset the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('open')
                .setDescription('Open the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('openvoting')
                .setDescription('Open voting of the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('getuser')
                .setDescription('See who submitted a picture')
                .addStringOption(option => option.setName('messageid').setDescription('MessageID of picture').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete submission from user')
                .addStringOption(option => option.setName('messageid').setDescription('MessageID of picture').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('Reason for deletion').setRequired(true))),
    async execute(interaction) {
        switch(interaction.options.getSubcommand()) {
        case 'getuser':
            await interaction.deferReply()
            var messageId = interaction.options.getString('messageid')
            let userId = await photocontestHandler.getEntry(messageId).catch(err => {
                interaction.editReply('Experienced error while getting user')
            })
            if (userId)
                interaction.editReply(`The user that entered this submission is: <@${userId}>`)
            else
                interaction.editReply('This is not a valid messageid')
            break
        case 'delete':
            await interaction.deferReply()
            var messageId = interaction.options.getString('messageid')
            var reason = interaction.options.getString('reason')
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            var botlogsChannel = interaction.guild.channels.cache.find(channel => channel.name === 'bot-logs')
            let message = await photocontestChannel.messages.fetch(messageId).catch(err => {
                interaction.editReply('I was not able to fetch this entry')
            })
            if (message) {
                let userId = await photocontestHandler.getEntry(messageId)
                await message.delete().catch(err => {
                    interaction.editReply('There was a problem with deleting the entry')
                })
                photocontestHandler.deleteMessage(messageId)
                await interaction.editReply(`Succesfully deleted the entry from <@${userId}>`)
                let user = interaction.client.users.cache.get(userId)
                if (user) {
                    const embed = new EmbedBuilder()
                        .setColor('#FF470F')
                        .setTitle('Removed entry')
                        .setAuthor({name: user.tag, iconUrl: user.avatarURL()})
                        .setDescription(reason)
                        .setTimestamp()
                        .setFooter({ text: 'ID: ' + userId})
                    botlogsChannel.send({embeds: [embed]})
                    if (!user.dmChannel) {
                        await user.createDM()
                    }
                    if (user.dmChannel) {
                        user.dmChannel.send({ content: `Your photocontest entry has been removed with the following reason: ${reason}`}).catch(err => {
                            interaction.followUp(`I failed to send a dm to <@${userId}>!`)
                        })
                        interaction.followUp(`I send a dm to <@${userId}> with the reason!`)
                    } else {
                        interaction.followUp(`I could not send a dm to <@${userId}>, their DMs are closed!`)
                    }
                } else {
                    interaction.followUp(`I could not send a dm to <@${userId}>!`)
                }
            } else
                interaction.editReply('This is not a valid entry')
            break
        case 'open':
            settingHandler.updateSetting('photocontest', true)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            await photocontestChannel.send(warningMessageContent)
            await photocontestChannel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name == 'Verified').id, { ViewChannel: true }).catch(err => {
                interaction.reply('I was not able to open the photo contest')
            })
            interaction.reply('Photocontest is now open, let the ugly pictures come in :))')
            break
        case 'close':
            settingHandler.updateSetting('photocontest', false)
            settingHandler.updateSetting('voting', false)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            photocontestChannel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name == 'Verified').id, { ViewChannel: false })
            var messages = await photocontestChannel.messages.fetch({ limit: 5 })
            messages.filter(message => message.content == warningMessageContent).forEach(message => {
                message.delete()
            })
            interaction.reply('The photocontest is now closed')
            break
        case 'openvoting':
            settingHandler.updateSetting('voting', true)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            let oldWarnMessage = photocontestChannel.messages.cache.find(message => message.content == warningMessageContent)
            if (oldWarnMessage) {
                oldWarnMessage.delete()
            }
            var messages = await photocontestChannel.messages.fetch({ limit: 5 })
            messages.filter(message => message.content == warningMessageContent).forEach(message => {
                message.delete()
            })
            interaction.reply('Voting is now open!')
            break
        case 'getvotes':
            await interaction.deferReply()
            let votes = await photocontestHandler.getVotes()
            console.log(votes)
            let embeds = []
            embeds.push(new EmbedBuilder()
                .setColor('#000000')
                .setTitle('Votes')
            )
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            for (let i in votes) {
                entry = votes[i]
                let textMessage = await photocontestChannel.messages.fetch(entry.messageid).catch(error => {})
                let member = await interaction.guild.members.fetch(entry.id).catch(error => {})
                let currentEmbed = embeds[embeds.length - 1]
                if (currentEmbed.fields && currentEmbed.fields.length >= 25) {
                    embeds.push(new EmbedBuilder()
                        .setColor('#000000'))
                    currentEmbed = embeds[embeds.length - 1]
                }
                if (textMessage && member) {
                    currentEmbed.addFields({name: member.user.tag, value: `[Votes: ${entry.votes}](${textMessage.url})`})
                } else {
                    currentEmbed.addFields({name: "Invalid entry", value: `[Votes: ${entry.votes}]`})
                }
            }
            interaction.editReply({embeds: embeds})
            break
        case 'reset':
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Reset contest')
                        .setEmoji('⚠️')
                        .setCustomId('reset_contest')
                        .setStyle(ButtonStyle.Danger),
                )
            interaction.reply({ 
                content: 'Are you sure you want to reset the contest?', 
                components: [actionRow],
                ephemeral: true 
            })
            break
        }
    }
}