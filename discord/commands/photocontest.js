const commandUtil = require('./../utility/commandUtil.js')
const clientHandler = require('./../client.js')
const channels = require('./../channels.js')
const guilds = require('./../guilds.js')
const delay = require('./../utility/delay.js')
const photocontestHandler = require('./../../database/photocontestHandler.js')
const settingHandler = require('./../../database/settingHandler.js')
const permissionManager = require('./permissionManager.js')
const discord = require('discord.js')

const { MessageButton } = require('discord-buttons');

const COOLDOWN = 3
let votingOpen
let photocontestOpen
(async () => {
    votingOpen = await settingHandler.getSetting('voting') === 'true'
    photocontestOpen = await settingHandler.getSetting('photocontest') === 'true'
})()

const helpInfo = {
    command: 'photocontest/pc',
    description: 'commands used for the photocontest \n**Cooldown:** 3 seconds',
    fields: [
        {
            name: "Sub commands:", 
            value: `submit - submit your photocontest entry, include your photo when you use this command!
            remove/delete - remove your photocontest entry
            checkout - check out your photocontest entry, bot sends a dm with your entry
            voted - check for which photo you voted, bot sends a dm with a link to your vote
        `},
    ]
}

permissionManager.configure('pc', {
    tiers: {
        '1': ['Photo Contest', 'Moderator'],
        '2': ['Event Manager', 'Lead Developer']
    },
    permissions: {
        '0': {channels: {'botcommands': true}},
        '1': {channels: {'botcommands': true}, commands: {'submit': true, 'remove': true, 'checkout': true, 'delete': true}},
        '2': {}
    },
    notification: 'Please use `!rank Photo Contest` to join the photo contest'
})

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
    let command = args[1] === undefined ? null : args[1].toLowerCase()
    if (!permissionManager.hasPermissions(message, 'pc', args[1])) return
    if (!command) {
        await commandUtil.help(message, helpInfo)
        return
    }
    if (command == 'submit') {
        if (!photocontestOpen) {
            await message.lineReplyNoMention('The photo contest is currently not accepting submissions!')
            return
        }
        if (isOnCooldown(message)) return
        if (message.attachments.size) {
            if (message.attachments.size > 1) {
                await message.lineReplyNoMention('You submited miliple images, please only include one!')
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
                    await message.lineReplyNoMention('Your submission was successful, if you want to check out your submission use `!photocontest checkout`')
                }
            } else {
                await message.lineReplyNoMention('This is not a valid image! The supported file types are: png, jpg, jpeg')
            }
        } else {
            await message.lineReplyNoMention('I could not find an image, please include your entry!')
        }
        message.delete()
    } else if (command == 'remove' || command == 'delete') {
        if (isOnCooldown(message)) return
        if (args[2] && permissionManager.hasRole(message.member, ['Event Manager', 'Lead Developer', 'Moderator'])) {
            let userId
            try {
                let entry = await channels.photoContest.messages.fetch(args[2])
                userId = await photocontestHandler.getEntry(args[2])
                if (entry) {
                    entry.delete()
                }
                photocontestHandler.deleteMessage(args[2])
                message.lineReplyNoMention('Successfully deleted this entry!')
                commandUtil.sendLog('Removed entry', clientHandler.client.users.cache.get(userId), 'Did not follow photocontest rules')
            } catch (error) {
                console.log(error)
                message.lineReplyNoMention('An error occurred while deleting the message!')
            }
        } else {
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
        }
    } else if (command == 'checkout') {
        if (isOnCooldown(message)) return
        let entryId = await photocontestHandler.getMessage(message.member.id)
        if (entryId) {
            try {
                let entry = await channels.photoContest.messages.fetch(entryId)
                if (entry) {
                    let dm = await message.member.createDM()
                    dm.send('Your recent entry:', {files: [entry.attachments.first()]}).catch(() => message.lineReplyNoMention('Your DMs are closed, open them if you want to check out your entry!'))
                } else {
                    message.lineReplyNoMention('Failed to find entry!')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            message.lineReplyNoMention('I was not able to find any entries from you, you can submit one using `!photocontest submit`')
        }
    } else if (command == 'voted') {
        if (isOnCooldown(message)) return
        let voteId = await photocontestHandler.getVote(message.member.id)
        if (voteId) {
            try {
                let entry = await channels.photoContest.messages.fetch(voteId)
                if (entry) {
                    let dm = await message.member.createDM()
                    dm.send(`You voted for this picture: ${entry.url}`).catch(() => message.lineReplyNoMention('Your DMs are closed, open them if you want to know who you voted for!'))
                } else {
                    message.lineReplyNoMention('Failed to find entry!')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            message.lineReplyNoMention('You haven\'t voted yet!')
        }
    } else if (command == 'getvotes' || command == 'votes') {
        if (isOnCooldown(message)) return
        let votes = await photocontestHandler.getVotes()
        let messages = await photocontestHandler.getEntries()
        let entries = {}
        messages.forEach(message => {
            entries[message.messageid] = {votes: 0, member: clientHandler.client.users.cache.get(message.id)}
        })
        votes.forEach(vote => {
            if (entries[vote.messageid]) entries[vote.messageid].votes += 1
        })
        let embeds = []
        embeds.push(new discord.MessageEmbed()
            .setColor('#000000')
            .setTitle('Votes'))
        for (let i in entries) {
            entry = entries[i]
            let currentEmbed = embeds[embeds.length - 1]
            if (currentEmbed.fields.length >= 25) {
                embeds.push(new discord.MessageEmbed()
                    .setColor('#000000'))
                currentEmbed = embeds[embeds.length - 1]
            }
            currentEmbed.addField(entry.member.tag, `Votes: ${entry.votes}`)
        }
        for (let i in embeds) {
            message.channel.send(embeds[i])
        }
    } else if (command == 'reset') {
        message.channel.send("Are you sure you want to reset the photocontest? Reply with **yes**")
        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] })
            .then(async(collection) => {
                let answer = collection.first()
                if (answer.content.toLowerCase() == 'yes') {
                    photocontestHandler.clearEntries()
                    photocontestHandler.clearVotes()
                    let messages = 1
                    while(messages > 0) {
                        messages = await channels.photoContest.bulkDelete(100)
                    }
                    settingHandler.updateSetting('photocontest', false)
                    photocontestOpen = false
                    settingHandler.updateSetting('voting', false)
                    votingOpen = false
                    channels.photoContest.updateOverwrite(guilds.streamlinedGuild.roles.cache.find(r => r.name == 'Verified'), {['VIEW_CHANNEL']: false})
                    answer.lineReplyNoMention('Successfully cleared the photocontest, start a new one with `!photocontest start`')
                } else {
                    answer.lineReplyNoMention('Canceled command')
                }
            })
            //.catch(_collected => message.channel.send("Timeout"))
    } else if (command == 'start' || command == 'open') {
        settingHandler.updateSetting('photocontest', true)
        photocontestOpen = true
        message.lineReplyNoMention('Photocontest is now open, let the ugly pictures come in :))')
    } else if (command == 'close' || command == 'end') {
        settingHandler.updateSetting('photocontest', false)
        photocontestOpen = false
        settingHandler.updateSetting('voting', false)
        votingOpen = false
        channels.photoContest.updateOverwrite(guilds.streamlinedGuild.roles.cache.find(r => r.name == 'Verified'), {['VIEW_CHANNEL']: false})
        message.lineReplyNoMention('Submissions and voting are now closed!')
    } else if (command == 'openvoting') {
        settingHandler.updateSetting('photocontest', false)
        photocontestOpen = false
        settingHandler.updateSetting('voting', true)
        votingOpen = true
        channels.photoContest.updateOverwrite(guilds.streamlinedGuild.roles.cache.find(r => r.name == 'Verified'), {['VIEW_CHANNEL']: true})
        message.lineReplyNoMention('Voting is now open!')
    } else if (command == 'getmember' || command == 'getuser') {
        if (args[2]) {
            let memberId = await photocontestHandler.getEntry(args[2])
            if (memberId) {
                let member = clientHandler.client.users.cache.get(memberId)
                if (member) {
                    message.lineReplyNoMention(`The user that entered this photo is: <@${memberId}>`)
                } else {
                    message.lineReplyNoMention('I was not able to find the user of this message!')
                }
            } else {
                message.lineReplyNoMention('This is not a valid message id!')
            }
        } else {
            message.lineReplyNoMention('Please provide a message id of an entry.')
        }
    } else {
        await commandUtil.help(message, helpInfo)
    }
}

clientHandler.client.on('clickButton', async (button) => {
    await button.think(true)
    if (!votingOpen) {
        button.reply.edit('Voting is closed!', true) 
        return
    } else if (!(await photocontestHandler.getEntry(button.message.id) == button.clicker.user.id)) {
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