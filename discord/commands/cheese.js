const commandUtil = require('./../utility/commandUtil.js')
const clientHandler = require('./../client.js')

module.exports = function(message) {
    if(commandUtil.isAdmin(message)){
        const generalChannel = clientHandler.client.channels.cache.find(channel => channel.name === 'general')
        generalChannel.send('I like cheese')
    };
}