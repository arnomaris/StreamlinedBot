const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const photocontestHandler = require('./../database/photocontestHandler.js')
const settingHandler = require('./../database/settingHandler.js')

const warningMessageContent = 'The photo contest is currently accepting submissions! Use `/photocontest submit` with your picture in #botcommands\nVoting is currently closed, wait until the announcement to vote!'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('photocontest')
        .setDescription('Interact with the photo contest')
	    .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('submit')
                .setDescription('Submit your picture to the photo contest')
                .addAttachmentOption(option => option.setName('attachment').setDescription('Your picture').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete your submitted picture'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Delete your submitted picture'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('checkout')
                .setDescription('Checkout the picture you submitted to the photo contest'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('voted')
                .setDescription('See the submission you voted for')),
    async execute(interaction) {
        if (interaction.member.roles.cache.find(role => role.name === 'Photo Contest Ban')) {
            interaction.reply({ 
                content: 'You are currently not allowed to participate in photo contests.', 
                ephemeral: true 
            })
            return
        }
        if (!interaction.member.roles.cache.find(role => role.name === 'Photo Contest')) {
            const actionRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Join photo contest')
                        .setEmoji('📷')
                        .setCustomId('join_photocontest')
                        .setStyle(ButtonStyle.Primary),
                )
            interaction.reply({ 
                content: 'You are not participating in the photo contest yet, join by clicking the button below.', 
                components: [actionRow],
                ephemeral: true 
            })
            return
        }
        switch(interaction.options.getSubcommand()) {
            case 'submit':
                await interaction.deferReply({ ephemeral: true })
                let photoContestOpen = await settingHandler.getSetting('photocontest', interaction.guild.id).catch(err => {
                    interaction.reply({content: 'Experienced error while sumbitting your picture', ephemeral: true})
                })
                if (photoContestOpen === 'false') {
                    interaction.editReply('The photo contest is currently not accepting submissions!')
                    return
                }

                const attachment = interaction.options.getAttachment('attachment')
                let attachementUrl = attachment.url
                if (attachementUrl.endsWith('png') || attachementUrl.endsWith('jpeg') || attachementUrl.endsWith('jpg')) {
                    let lastSubmission = await photocontestHandler.getMessage(interaction.user.id, interaction.guild.id).catch(err => {
                        interaction.editReply('Experienced error while checking submission validity, please try again')
                    })
                    if (lastSubmission == null) {
                        let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Vote')
                                    .setEmoji('👍')
                                    .setCustomId('photo_vote')
                                    .setStyle(ButtonStyle.Success),
                            )

                        let submission = await photocontestChannel.send({
                            files: [{
                                attachment: attachment.url
                            }],
                            components: [actionRow]
                        })

                        photocontestHandler.setMessage(interaction.user.id, submission.id, interaction.guild.id).catch(err => {
                            interaction.editReply('Experienced error while sumbitting your picture')
                            submission.delete()
                        })
                        await interaction.editReply(`Your submission was successful, if you want to check out your submission use </photocontest checkout:${interaction.id}>`)

                        let messages = await photocontestChannel.messages.fetch({ limit: 5 })
                        messages.filter(message => message.content == warningMessageContent).forEach(message => {
                            message.delete()
                        })
                        photocontestChannel.send({ content: warningMessageContent })
                    } else if (lastSubmission != undefined) {
                        await interaction.editReply(`You already submitted a picture, use </photocontest delete:${interaction.id}> first if you want to change your entry!`)
                    }
                } else {
                    await interaction.editReply('Your submission is not a valid image, only PNG, JPEG or JPG are accepted file types.')
                }
                break
            case 'remove': // alias for delete
            case 'delete':
                await interaction.deferReply({ ephemeral: true })
                var entryId = await photocontestHandler.getMessage(interaction.user.id, interaction.guild.id).catch(err => {
                    interaction.editReply('An error occurred while deleting your entry, please try again')
                })
                if (entryId) {
                    let photoContestOpen = await settingHandler.getSetting('photocontest', interaction.guild.id).catch(err => {
                        interaction.reply({content: 'Experienced error while deleting your picture', ephemeral: true})
                    })
                    if (photoContestOpen === 'false') {
                        interaction.editReply('The photo contest closed, you can no longer remove your submission!')
                        return
                    }
                    try {
                        let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
                        let entry = await photocontestChannel.messages.fetch(entryId).catch(err => {
                            photocontestHandler.deleteEntry(interaction.user.id, interaction.guild.id)
                            interaction.editReply('Your submission was corrupted, you can submit a new picture now.')
                        })
                        if (entry) {
                            await entry.delete().catch(err => {
                                interaction.editReply('There was a problem with deleting your entry')
                            })
                            photocontestHandler.deleteEntry(interaction.user.id, interaction.guild.id)
                            interaction.editReply('Succesfully deleted your entry')
                        } else {
                            interaction.editReply('An error occurred while deleting your entry, please try again')
                        }
                    } catch (error) {
                        console.log(error)
                        interaction.editReply('Experienced error while deleting your entry')
                    }
                } else {
                    interaction.editReply(`I was not able to find any entries from you, you can submit one using </photocontest submit:${interaction.id}>`)
                }
                break
            case 'checkout':
                await interaction.deferReply({ ephemeral: true })
                var entryId = await photocontestHandler.getMessage(interaction.user.id, interaction.guild.id).catch(err => {
                    interaction.editReply('Experienced error while getting your submission')
                })
                if (entryId) {
                    if (!interaction.user.dmChannel) {
                        await interaction.user.createDM()
                    }
                    let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
                    let entry = await photocontestChannel.messages.fetch(entryId).catch(err => {
                        interaction.editReply('There was an error while fetching your entry')
                    })
                    if (interaction.user.dmChannel) {
                        interaction.user.dmChannel.send({ 
                            content: "This is your most recent submission:", 
                            files: [{
                                attachment: entry.attachments.first().url
                            }]
                        }).catch(err => {
                            interaction.editReply(`I could not send you a DM!`)
                        })
                        interaction.editReply(`I send your submission in DM's!`)
                    } else {
                        interaction.editReply(`I could not send you a DM, make sure your DMs are open!`)
                    }
                } else {
                    interaction.editReply('I was not able to find any entries from you, you can submit one using `/photocontest submit`')
                }
                break
            case 'voted':
                await interaction.deferReply({ephemeral: true})
                let voteId = await photocontestHandler.getVote(interaction.user.id, interaction.guild.id)
                if (voteId) {
                    let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
                    interaction.editReply(`You voted for: https://discord.com/channels/${interaction.guild.id}/${photocontestChannel.id}/${voteId}`)
                } else
                    interaction.editReply('You did not vote for anyone yet!')
                break
        }
    }
}