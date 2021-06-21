const arrayUtil = require('./../utility/arrayUtil.js')

let config = {}

exports.hasRole = function(member, roles) {
    return arrayUtil.contains(roles, member.roles.cache)
}

exports.configure = function(command, permissions) {
    config[command] = permissions
}

exports.hasPermissions = function(message, command, subcommand) {
    let commandPermissions = config[command]
    let permissionTier = '0'
    for([i, tier] of Object.entries(commandPermissions.tiers)) {
        if (module.exports.hasRole(message.member, tier)) {
            permissionTier = i
        }
    }
    if (commandPermissions.permissions[permissionTier].channels) {
        if (!commandPermissions.permissions[permissionTier].channels[message.channel.name]) return false
    }
    if (permissionTier == '0') {
        if (commandPermissions.notification) {
            message.lineReplyNoMention(commandPermissions.notification)
        }
        return false
    }
    if (subcommand && commandPermissions.permissions[permissionTier].commands) {
        if (!commandPermissions.permissions[permissionTier].commands[subcommand]) return false
    }
    return true
}