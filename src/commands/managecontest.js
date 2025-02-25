const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, Collection, SnowflakeUtil } = require('discord.js')
const photocontestHandler = require('./../database/photocontestHandler.js')
const settingHandler = require('./../database/settingHandler.js')

const warningMessageContent = 'The photo contest is currently accepting submissions! Use `/photocontest submit` with your picture in #botcommands\nVoting is currently closed, wait until the announcement to vote!'
const votingMessage = 'Voting is open, make sure to look at all the submissions and vote for you favorite one!'

function createVotesEmbed(votes) {
    return Promise.new(async (resolve, reject) => {
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
            if (currentEmbed.data.fields && currentEmbed.data.fields.length >= 25) {
                if (embeds.length == 1) {
                    interaction.editReply({embeds: [currentEmbed]})
                } else {
                    interaction.channel.send({embeds: [currentEmbed]})
                }
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
        resolve(embeds)
    })
}


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
                .setName('getwinners')
                .setDescription('Get amount of provided winners of the photo contest')
                .addNumberOption(option => option.setName('amount').setDescription('Amount of winners').setRequired(false)))
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
            let userId = await photocontestHandler.getEntry(messageId, interaction.guild.id).catch(err => {
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
                let userId = await photocontestHandler.getEntry(messageId, interaction.guild.id)
                await message.delete().catch(err => {
                    interaction.editReply('There was a problem with deleting the entry')
                })
                photocontestHandler.deleteMessage(messageId, interaction.guild.id)
                await interaction.editReply(`Succesfully deleted the entry from <@${userId}>`)
                let user = interaction.client.users.cache.get(userId)
                if (user) {
                    const embed = new EmbedBuilder()
                        .setColor('#FF470F')
                        .setTitle('Removed entry')
                        .setAuthor({name: user.tag, iconUrl: user.avatarURL()})
                        .setDescription(reason)
                        .setTimestamp()
                        .setImage(message.attachments.first().proxyURL)
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
            settingHandler.updateSetting('photocontest', interaction.guild.id, true)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            
            var messages = await photocontestChannel.messages.fetch({ limit: 5 })
            messages.filter(message => message.content == votingMessage).forEach(message => {
                message.delete()
            })

            await photocontestChannel.send(warningMessageContent)
            await photocontestChannel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name == 'Verified').id, { ViewChannel: true }).catch(err => {
                interaction.reply('I was not able to open the photo contest')
            })
            interaction.reply('Photocontest is now open, let the ugly pictures come in :))')
            break
        case 'close':
            settingHandler.updateSetting('photocontest', interaction.guild.id, false)
            settingHandler.updateSetting('voting', interaction.guild.id, false)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')
            photocontestChannel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name == 'Verified').id, { ViewChannel: false })
            var messages = await photocontestChannel.messages.fetch({ limit: 5 })
            messages.filter(message => message.content == warningMessageContent || message.content == votingMessage).forEach(message => {
                message.delete()
            })
            interaction.reply('The photocontest is now closed')
            break
        case 'openvoting':
            settingHandler.updateSetting('photocontest', interaction.guild.id, false)
            settingHandler.updateSetting('voting', interaction.guild.id, true)
            var photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest')

            var messages = await photocontestChannel.messages.fetch({ limit: 5 })
            messages.filter(message => message.content == warningMessageContent || message.content == votingMessage).forEach(message => {
                message.delete()
            })

            let entries = await photocontestHandler.getEntries(interaction.guild.id)
            entries.sort((entryA, entryB) => SnowflakeUtil.timestampFrom(entryA.messageid) - SnowflakeUtil.timestampFrom(entryB.messageid))
            console.log(entries[0])

            var actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('To top')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${photocontestChannel.id}/${entries[0].messageid}`),
                    new ButtonBuilder()
                        .setLabel('My vote')
                        .setCustomId('voted')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setLabel('Remove vote')
                        .setCustomId('remove_vote')
                        .setStyle(ButtonStyle.Danger),
                )
            await photocontestChannel.send({
                content: votingMessage,
                components: [actionRow]
            })

            interaction.reply('Voting is now open!')
            break
        case 'getvotes':
            await interaction.deferReply()
            await photocontestHandler.getVotes(interaction.guild.id).then(votes => 
                createVotesEmbed(votes).then((embeds) => {
                    if (embeds.length == 1) {
                        interaction.editReply({embeds: [embeds[embeds.length - 1]]})
                    } else {
                        interaction.channel.send({embeds: [embeds[embeds.length - 1]]})
                    }
                }))
            break
        case 'getwinners':
            const amount = interaction.options.getMember('amount')
            await photocontestHandler.getWinners(interaction.guild.id, amount).then(votes => 
                createVotesEmbed(votes).then((embeds) => {
                    if (embeds.length == 1) {
                        interaction.editReply({embeds: [embeds[embeds.length - 1]]})
                    } else {
                        interaction.channel.send({embeds: [embeds[embeds.length - 1]]})
                    }
                }))
            break
        case 'reset':
            var actionRow = new ActionRowBuilder()
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