const commandUtil = require('./../utility/commandUtil.js')
const clientHandler = require('./../client.js')
const channels = require('./../channels.js')
const delay = require('./../utility/delay.js')
const photocontestHandler = require('./../../database/photocontestHandler.js')

const { MessageButton } = require('discord-buttons');

const COOLDOWN = 3

const helpInfo = {
    command: 'photocontest/pc',
    description: 'commands used for the photocontest \n**Cooldown:** 3 seconds',
    fields: [
        {name: "Sub commands:", 
        value: `submit - submit your photocontest entry
        remove/delete - remove your photocontest entry
        checkout - checkout your photocontest entry
        `}
    ]
}


let cooldownManager = {}

function isOnCooldown(message) {
    if (cooldownManager[message.member.id]) {
        let time = Math.floor((Date.now() - cooldownManager[message.member.id]) / 1000)
        if (time < COOLDOWN) {
            message.lineReplyNoMention(`This command is on cooldown: ${COOLDOWN - time} seconds left`)
            return true
        } else {
            cooldownManager[message.member.id] = Date.now()
            return false
        }
    } else {
        cooldownManager[message.member.id] = Date.now()
        return false
    }
}

module.exports = async function(message) {
    let args = message.content.split(/[ ]+/)
    if (args[1] && args[1].toLowerCase() == 'submit') {
        if (message.attachments.size) {
            if (isOnCooldown(message)) return
            if (message.attachments.size > 1) {
                await message.lineReplyNoMention('You submited multiple images, please only include one!')
            } else if (commandUtil.isImage(message.attachments.first())) {
                if (await photocontestHandler.getMessage(message.member.id)) {
                    await message.lineReplyNoMention('You already submited an entry, use `!photocontest remove` first if you want to change your entry!')
                } else {    
                    let button = new MessageButton()
                        .setStyle('green')
                        .setLabel('Vote')
                        .setEmoji('👍')
                        .setID("photo_vote")
                    let submission = await channels.photoContest.send("", {files: [message.attachments.first()], component: button})
                    photocontestHandler.setMessage(message.member.id, submission.id)
                    await message.lineReplyNoMention('Your submission was successful, if you want to checkout your submission use `!photocontest checkout`')
                }
            } else {
                await message.lineReplyNoMention('This is not a valid image!')
            }
        } else {
            await message.lineReplyNoMention('I could not find an image, please include your entry!')
        }
        message.delete()
    } else if (args[1] && (args[1].toLowerCase() == 'remove' || args[1].toLowerCase() == 'delete')) {
        if (isOnCooldown(message)) return
        let entryId = await photocontestHandler.getMessage(message.member.id)
        if (entryId) {
            try {
                let entry = await channels.photoContest.messages.fetch(entryId)
                if (entry) {
                    entry.delete()
                }
            } catch (error) {
                console.log(error)
            }
            photocontestHandler.deleteEntry(message.member.id)
            message.lineReplyNoMention('Successfully deleted your entry!')
        } else {
            message.lineReplyNoMention('I was not able to find any entries from you, you can submit one using `!photocontest submit`')
        }
    } else if (args[1] && args[1].toLowerCase() == 'checkout') {
        if (isOnCooldown(message)) return
        let entryId = await photocontestHandler.getMessage(message.member.id)
        if (entryId) {
            try {
                let entry = await channels.photoContest.messages.fetch(entryId)
                if (entry) {
                    let dm = await message.member.createDM()
                    dm.send('Your recent entry:', {files: [entry.attachments.first()]}).catch(() => message.lineReplyNoMention('Your DMs are closed, open them if you want to checkout your entry!'))
                } else {
                    message.lineReplyNoMention('Failed to find entry!')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            message.lineReplyNoMention('I was not able to find any entries from you, you can submit one using `!photocontest submit`')
        }
    } else {
        await commandUtil.help(message, helpInfo)
    }
}

clientHandler.client.on('clickButton', async (button) => {
    await button.think(true)
    if (!(await photocontestHandler.getEntry(button.message.id) == button.clicker.user.id)) {
        photocontestHandler.getVote(button.clicker.user.id).then(async (value) => {
            if (value) {
                photocontestHandler.updateVote(button.clicker.user.id, button.message.id)
                await button.reply.edit('Changed your vote successfully', true)
            } else {
                photocontestHandler.setVote(button.clicker.user.id, button.message.id)
                await button.reply.edit('Registered vote', true)
            }
        })
    } else {
        await button.reply.edit('You can not vote for yourself!', true)
    }
});