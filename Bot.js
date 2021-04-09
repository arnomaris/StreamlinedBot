const clientHandler = require('./discord/client.js')
const connection = require('./database/connection.js')
const dataHandler = require('./database/dataHandler.js')

clientHandler.login()
connection.connect()

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

require('./discord/messageHandler.js')
require('./discord/reactionHandler.js')
require('./discord/voiceHandler.js')


/*
dataHandler.getValue("suggestionIndex").then(value => console.log)
dataHandler.updateValue("suggestionIndex", "1")
dataHandler.getValue("suggestionIndex").then(value => console.log)
*/
