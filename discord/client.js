const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

const channels = require('./channels.js')
const guilds = require('./guilds.js')

require('dotenv').config();

exports.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]})

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

exports.login = function() {
    console.log("Logging in")
    module.exports.client.login(process.env.DISCORD_TOKEN)
}

module.exports.client.once("ready", () => {
    console.log(`Logged in as ${module.exports.client.user.tag}!`)

    /*module.exports.client.api.applications(module.exports.client.user.id).commands.put().then(console.log)*/

    module.exports.client.user.setActivity(" fetch with doggo cows")

    // Get streamlined guid
    guilds.streamlinedGuild = module.exports.client.guilds.cache.get(process.env.streamlinedGuild)
        
    // Get channels
    channels.suggestionRules = module.exports.client.channels.cache.get(process.env.suggestionRules)
    channels.photoContest = module.exports.client.channels.cache.get(process.env.photoContest)
    channels.logChannel = module.exports.client.channels.cache.get(process.env.logChannel)
    channels.micChannel = module.exports.client.channels.cache.get(process.env.micChannel)

    channels.photoContest.messages.fetch(true, true)
})
