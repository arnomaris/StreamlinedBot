const {Client} = require('discord.js')
require('discord-reply');

const channels = require('./channels.js')
const guilds = require('./guilds.js')

require('dotenv').config();

exports.client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
require('discord-buttons')(module.exports.client)

exports.login = function() {
    console.log("Logging in")
    module.exports.client.login(process.env.DISCORD_TOKEN)
    
    module.exports.client.on("ready", () => {
        console.log(`Logged in as ${module.exports.client.user.tag}!`)

        module.exports.client.api.applications(module.exports.client.user.id).commands.put({
            data: [{
                name: "game",
                description: "Get the link to the game",
            },{
                name: "trello",
                description: "Get the link to the roadmap",
            },{
                name: "roadmap",
                description: "Get the link to the roadmap",
            },{
                name: "changelog",
                description: "Get the link to the changelog",
            },{
                name: "ost",
                description: "Get the link to the ost",
            },{
                name: "wiki",
                description: "Get the link to the wiki",
            },{
                name: "discord",
                description: "Get the invite link to the Discord",
            },{
                name: "tutorial",
                description: "Get the invite link to the games tutorial",
            },{
                name: "ping",
                description: "Check Doggo Assistant's response time to Discord",
            },]
        }).then(console.log)

        module.exports.client.user.setActivity(" fetch with doggo cows")
            .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
            .catch(console.error)

        // Get streamlined guid
        guilds.streamlinedGuild = module.exports.client.guilds.cache.get(process.env.streamlinedGuild)
            
        // Get channels
        channels.suggestionRules = module.exports.client.channels.cache.get(process.env.suggestionRules)
        channels.photoContest = module.exports.client.channels.cache.get(process.env.photoContest)
        channels.logChannel = module.exports.client.channels.cache.get(process.env.logChannel)
        channels.micChannel = module.exports.client.channels.cache.get(process.env.micChannel)

        //channels.suggestionRules.messages.fetch(process.env.suggestionRulesMessage)
        //    .then(_ => console.log("Got suggestion rules message!"))
        //   .catch(console.error)
    
        channels.photoContest.messages.fetch(true, true)
    });
}