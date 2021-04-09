const commandUtil = require('./../utility/commandUtil.js')

module.exports = function(message) {
    if (commandUtil.isAdmin(message) || message.channel.id == process.env.botChannel || message.channel.id == process.env.nitrobooster || message.channel.id == process.env.secretBotcommands || message.channel.id == process.env.moderators) {
        try {
            commandUtil.getMember(message).then((member) => {
                if (!member) {
                    message.channel.send("That is not a valid member!")
                } else if (member.premiumSince) {
                    message.channel.send(member.displayName + " has been boosting since `" + member.premiumSince.toLocaleDateString("nl-NL") + "`")
                } else {
                    message.channel.send(member.displayName + " is not a booster <:doggosad:610744652781322251>")
                }
            })
        } catch(error) {
            message.channel.send("Failed to run command!")
        }
    }
}