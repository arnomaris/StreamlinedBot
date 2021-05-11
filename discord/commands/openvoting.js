const channels = require('./../channels.js')
const commandUtil = require('./../utility/commandUtil.js')

module.exports = function(message) {
    if(commandUtil.isAdmin(message) || commandUtil.hasRole(message.member, "Event Manager")){
        try{
            channels.photoContest.messages.cache.forEach(m => {
                if (!commandUtil.isAdmin(m) || !commandUtil.hasRole(m.member, "Event Manager")) {
                    m.react('👍')
                }
            })
        } catch (error) {
            console.error(error)
        }
    }
}