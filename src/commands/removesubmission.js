const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, EmbedBuilder, ComponentType, MessageFlags, InteractionContextType } = require('discord.js');
const photocontestHandler = require('./../database/photocontestHandler.js')
const deletereason = require('../selectmenus/deletereason.js')

const reasons = {
    lights: 'Your photo contest submission has been removed due to your train lights not being on, please read the rules and you are more than welcome to resubmit!',
    theme: 'Your photo contest submission has been removed due to your submission not following this weeks theme, please read the rules and you are more than welcome to resubmit!',
    rules: 'Your photo contest submission has been removed due to your submission not following the rules, please read the rules and you are more than welcome to resubmit!',
    edited: 'Your photo contest submission has been removed due to your submission being edited, please read the rules and you are more than welcome to resubmit!'
}

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Remove submission')
        .setType(ApplicationCommandType.Message)
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    async execute(interaction) {
        const response = await deletereason.execute(interaction);

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect, 
        }); // create select menu collector
        collector.on("collect", async (selectionInteraction) => {
            await selectionInteraction.deferReply({ flags: MessageFlags.Ephemeral })
            const value = selectionInteraction.values[0] // first value in collector
            const reason = reasons[value]
            const botlogsChannel = interaction.guild.channels.cache.find(channel => channel.name === 'bot-logs')
            const message = interaction.targetMessage
            const messageId = interaction.targetMessage.id
            const attachments = message.attachments
            const userId = await photocontestHandler.getEntry(messageId, interaction.guild.id)

            await message.delete().catch(err => {
                selectionInteraction.editReply('There was a problem with deleting the entry')
            })

            photocontestHandler.deleteMessage(messageId, interaction.guild.id)
            await selectionInteraction.editReply(`Succesfully deleted the entry from <@${userId}>`)

            const user = interaction.client.users.cache.get(userId)
            if (user) {
                const embed = new EmbedBuilder()
                    .setColor('#FF470F')
                    .setTitle('Removed entry')
                    .setAuthor({name: user.tag, iconUrl: user.avatarURL()})
                    .setDescription(reason)
                    .setTimestamp()
                    .setImage(attachments.first().proxyURL)
                    .setFooter({ text: 'ID: ' + userId})
                botlogsChannel.send({embeds: [embed]})
                if (!user.dmChannel) {
                    await user.createDM()
                }
                if (user.dmChannel) {
                    user.dmChannel.send({ content: `Your photocontest entry has been removed with the following reason: ${reason}`}).catch(err => {
                        selectionInteraction.followUp({content: `I failed to send a dm to <@${userId}>!`, flags: MessageFlags.Ephemeral })
                    })
                    selectionInteraction.followUp({ content: `I send a dm to <@${userId}> with the reason!`, flags: MessageFlags.Ephemeral })
                } else {
                    selectionInteraction.followUp({ content: `I could not send a dm to <@${userId}>, their DMs are closed!`, flags: MessageFlags.Ephemeral })
                }
            } else {
                selectionInteraction.followUp({ content: `I could not send a dm to <@${userId}>!`, flags: MessageFlags.Ephemeral })
            }
        });
    }
}