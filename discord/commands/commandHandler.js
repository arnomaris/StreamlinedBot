const commands = require('./commands.js')

exports.handleCommand = function(message) {
    let command = message.content.split(process.env.PREFIX)[1].toLowerCase()

    if (commands[command]) {
        commands[command](message)
    }
}