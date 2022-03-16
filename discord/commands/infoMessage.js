const clientHandler = require('./../client.js')
const randomUtil = require('./../utility/randomUtil.js')

const commands = {
    game: 'game',
    roadmap: 'roadmap',
    trello: 'roadmap',
    wiki: 'wiki',
    discord: 'discord',
    changelog: 'changelog',
    ost: 'ost',
    tutorial: 'tutorial',
}

const messageAnswers = {
    game: '<https://www.roblox.com/games/1788251222/Streamlined-ALPHA>',
    roadmap: '<https://trello.com/b/XRMAfup0/streamlined-roadmap>',
    wiki: '<https://streamlined.fandom.com/wiki/Streamlined_Wiki>',
    discord: 'https://discord.gg/Wmeugg8',
    changelog: '<https://devforum.roblox.com/t/streamlined-change-log/601247>',
    ost: '<https://www.youtube.com/watch?v=9VlVPbbumuo>',
    tutorial: '<https://devforum.roblox.com/t/streamlined-change-log/601247>'
}

const funnyMessages = {
    game: ["Good boy play Streamlined now!", "You shall play streamlined!", "Hmmm... are you sure you want to play Streamlined?", "Cheeselined", "Lets play fetch with doggo cows!", "Streamlined time!", "Lets a play Streamlined!", "Streamlined, yes *yes* **yes**"],
    roadmap: ["🔮*Gazes in future*🔮 this is what Streamlined will look like in 2030!", "I came from the future, I know what Streamlined is going to look like! *Shhh don't tell anyone*", "This game is gonna look hella lit", "OOooo shiny pretty things are going to come!"],
    wiki: ["Gain knowledge my young one!", "BRAINNNNNNN KNOWLEDGE", "It's like Streamlined but only the info!", "Some awesome people made this", "For the community by the community"],
    discord: ["Let's get this party started!", "Invite all your friends and extended family!", "Who are you going to invite? *they better be nice*", "Invite them **all**"],
    changelog: ["All the updates of the game!", "OOO something new?", "Did we update? Was too busy playing fetch!", "Awesome updates of an awesome game!"],
    ost: ["Play on repeat!", "Want to listen on the go? Also available on Spotify and Apple Music!", "TTTTttttttTTTTTTT", "If we only had an epic sax guy <:doggosad:610744652781322251>"],
    tutorial: ["Let's learn how to play the game!", "Wow this looks like a neat tutorial", "Did you know that you can drive trains in this game?", "Make sure to read it if you are a new player!"]
}

module.exports = function(message, isInteraction) {
    if (isInteraction) {
        let fMes = funnyMessages[message.data.name]
        clientHandler.client.api.interactions(message.id, message.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: fMes[randomUtil.random(fMes.length)] + "\n" + messageAnswers[message.data.name]
                }
            }
        })
    } else {
        let content = message.content.split(process.env.PREFIX)[1].toLowerCase()
        let command = commands[content]
        let fMes = funnyMessages[command]
        message.lineReplyNoMention(fMes[randomUtil.random(fMes.length)] + "\n" + messageAnswers[command])
    }
}