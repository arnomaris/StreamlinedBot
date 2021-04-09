const commandUtil = require('./../utility/commandUtil.js')

module.exports = function(message) {
    if(commandUtil.isAdmin(message)){
        const generalChannel = client.channels.cache.find(channel => channel.name === 'general')
        generalChannel.send('I like cheese')
    };
}