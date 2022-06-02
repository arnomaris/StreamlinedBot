const commandUtil = require('./../utility/commandUtil.js')

module.exports = function(message) {
    if (commandUtil.isAdmin(message) || message.channel.id == process.env.botChannel || message.channel.id == process.env.nitrobooster || message.channel.id == process.env.secretBotcommands || message.channel.id == process.env.moderators) {
        try {
            commandUtil.getMember(message).then((member) => {
                if (!member) {
                    message.reply({content: "That is not a valid member!", allowedMentions: { repliedUser: false }})
                } else if (member.premiumSince) {
                    message.reply({content: member.displayName + " has been boosting since `" + member.premiumSince.toLocaleDateString("nl-NL") + "`", allowedMentions: { repliedUser: false }})
                } else {
                    message.reply({content: member.displayName + " is not a booster <:doggosad:610744652781322251>", allowedMentions: { repliedUser: false }})
                }
            })
        } catch(error) {
            message.reply("Failed to run command!")
        }
    }
}