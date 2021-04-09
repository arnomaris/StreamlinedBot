const arrayUtil = require('./arrayUtil.js')
const channels = require('./../channels.js')
const discord = require('discord.js')
const guilds = require('./../guilds.js')

exports.hasRole = function(members, role){
    if(members && arrayUtil.pluck(members.roles.cache).includes(role)){
        return true
    } else {
        return false
    }
}

exports.isAdmin = function(message){
	if(module.exports.hasRole(message.member,'Lead Developer') || module.exports.hasRole(message.member,'Streamlined Owner')){
		return true
	}else{
		return false
	}
}

exports.sendErrorReply = function (message, replyMessage){
    message.reply(replyMessage)
    .then(reply => {
        reply.delete({timeout: 5000})
        .catch()
    })
}

exports.sendLog = function(violationType, user, reason) {
    const exampleEmbed = new discord.MessageEmbed()
        .setColor('#FF470F')
        .setTitle(violationType)
        .setAuthor(user.tag, user.avatarURL())
        .setDescription(reason)
        .setTimestamp()
        .setFooter('ID: ' + user.id)
    channels.logChannel.send(exampleEmbed)
}

exports.getMember = function(message) {
    return new Promise((resolve, reject) => {
        let arg = message.content.split(/[ ]+/)[1]
        if (!arg) {
            resolve(message.member)
        } else if (!isNaN(arg)) {
            guilds.streamlinedGuild.members.fetch(arg)
                .then(member => resolve(member))
                .catch(error => {
                    resolve(undefined) 
                    console.error(error)
                })
        } else {
            resolve(guilds.streamlinedGuild.members.cache.get(arg.replace(/[\\<>@#&!]/g, '')))
        }
    })
}

exports.getAmountOfReactions = function(channel, user) {
    return new Promise(resolve => {
        channel.messages.fetch().then(messages => {
            let count = messages.reduce(async (accumulatorP, message) => {
                let accumulator = await accumulatorP
                if (message.reactions.cache.first(1)[0]){
                    let users = await message.reactions.cache.first(1)[0].users.fetch()
                    if(users.has(user.id)){
                        accumulator += 1
                    }
                }
                return accumulator
            }, Promise.resolve(0))
            resolve(count)
        })
    })
}