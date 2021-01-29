const  {Client} = require('discord.js');;
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var token = 'MzEyOTIxODY0MDA1NDg0NTQ1.WRb1Mg.r-X5e-sSSVuetD8k4ojIftbrGUM'
var pastebintoken = "b85a1fde3f69f6c3f7353c234e13f666"
var prefix = "!"

var photoContestChannelId = '742420136488599653'
var suggestionChannel = '565445147324579851'
var streamlinedGuild
var photoContestChannel
var suggestionRules

const messageAnswers = {
    'game': '<https://www.roblox.com/games/1788251222/Streamlined-ALPHA>',
    'roadmap': '<https://trello.com/b/XRMAfup0/streamlined-road-map>',
    'wiki': '<https://streamlined.fandom.com/wiki/Streamlined_Wiki>',
    'discord': 'http://discord.gg/streamlined',
    'changelog': '<https://devforum.roblox.com/t/streamlined-change-log/601247>',
    'ost': '<https://www.youtube.com/watch?v=9VlVPbbumuo>',
}

const funnyMessages = {
    'game': ["Good boy play Streamlined now!", "You shall play streamlined!", "Hmmm... are you sure you want to play Streamlined?", "Cheeselined", "Lets play fetch with doggo cows!", "Streamlined time!", "Lets a play Streamlined!", "Streamlined, yes yes **yes**"],
    'roadmap': ["🔮*Gazes in future*🔮 this is what Streamlined will look like in 2030!", "I came from the future, I know what Streamlined is going to look like! *Shhh don't tell anyone*", "This game is gonna look hella lit", "OOooo shiny pretty things are going to come!"],
    'wiki': ["Gain knowledge my young one!", "BRAINNNNNNN KNOWLEDGE", "It's like Streamlined but only the info!", "Some awsome people made this", "For the community by the community"],
    'discord': ["Let's get this party started!", "Invite all your friends and extended family!", "Who are you going to invite? *he better be nice*", "Invite them **all**"],
    'changelog': ["All the updates of the game!", "OOO something new?", "Did we update? Was too busy playing fetch!", "Aswome updates of an aswome game!"],
    'ost': ["Play on repeat!", "Want to listen on the go? Also available on Spotify and Apple Music!", "TTTTttttttTTTTTTT", "If we only had an epic sax guy <:doggosad:610744652781322251>"]
}

client.login(token)

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(" fetch with doggo cows")
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);

    streamlinedGuild = client.guilds.cache.get("424256218916454411")
        
    suggestionRules = client.channels.cache.get("755911576510398504");
    if (!suggestionRules) return console.log("Invalid channel.");

    suggestionRules.messages.fetch("756132113421566125")
        .then(message => console.log("Got suggestion rules message!"))
        .catch(console.error);
    photoContestChannel = client.channels.cache.get(photoContestChannelId)
    photoContestChannel.messages.fetch()
});

function pluck(array){
    return array.map(function(item) { return item['name']; })
}

function random(max) {
    return Math.floor(Math.random() * max)
}

function hasRole(members, role){
    if(members && pluck(members.roles.cache).includes(role)){
        return true;
    } else {
        return false;
    }
}

function isAdmin(message){
	if(hasRole(message.member,"Lead Developer") || hasRole(message.member,"Streamlined Owner")){
		return true;
	}else{
		return false;
	}
}

function isCommand(command, message){
	var command = command.toLowerCase();
	const content = message.content.toLowerCase();
	return content.startsWith(prefix + command);
}

function sendErrorReply(message, replyMessage){
    message.reply(replyMessage)
    .then(reply => {
        reply.delete({timeout: 5000})
        .catch();
    })
}

client.on('message', (message) => {
    if(message.author.bot) return; // If the user who reacted is a bot, return
    if (message.channel.id == suggestionChannel){
        message.react('👍')
            .then(message.react('👎'))
            .catch(console.error)
    } else if (message.channel.id == photoContestChannelId){
        if(!isAdmin(message) && !hasRole(message.member, "Event Manager") && !hasRole(message.member, "Moderator")){
            if (message.content == ""){
                let count = 0
                message.channel.messages.cache.forEach(m =>{
                    if (m.member == message.member) {
                        count += 1
                    }
                })
                if (count > 1){
                    message.delete()
                    sendErrorReply(message, "Woops looks like you already posted a submission!")
                }
            } else {
                message.delete()
                sendErrorReply(message, "Woops looks like you added a caption to your submission!")
            }
        }
    }
    if(isCommand("cheese", message)){
        if(isAdmin(message)){
            const generalChannel = client.channels.cache.find(channel => channel.name === "general")
            generalChannel.send("I like cheese")
        };
    } else if (isCommand("openvoting", message)) {
        if(isAdmin(message) || hasRole(message.member, "Event Manager")){
            try{
                photoContestChannel.messages.cache.forEach(message => {
                    message.react('👍')
                })
            } catch (error) {
                console.error(error);
            }
        }
    }
    if (message.content.startsWith("!") && messageAnswers[message.content.split('!')[1].toLowerCase()]){
        var content = message.content.split('!')[1].toLowerCase()
        var fMes = funnyMessages[content]
        message.channel.send(fMes[random(fMes.length)] + "\n" + messageAnswers[content])
    }
});
  
function getAmountOfReactions(channel, user) {
    return new Promise(resolve => {
        channel.messages.fetch().then(messages => {
            let count = messages.reduce(async (accumulatorP, message) => {
                let accumulator = await accumulatorP
                if (message.reactions.cache.first(1)[0]){
                    let users = await message.reactions.cache.first(1)[0].users.fetch()
                    if(users.has(user.id)){
                        accumulator += 1
                    }
                }
                return accumulator
            }, Promise.resolve(0))
            resolve(count)
        })
    })
}

client.on('messageReactionAdd', async (messageReaction, user) => {
	if (messageReaction.partial) {
        try {
			await messageReaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
    }
    if(user.bot) return; // If the user who reacted is a bot, return
    if (messageReaction.message.id === "756132113421566125"){
        const member = streamlinedGuild.members.cache.get(user.id)
        if (!member.roles.cache.get("755934517906112555")){
            member.roles.add(streamlinedGuild.roles.cache.get("755899895239540826"))
        } else {
            try {
                messageReaction.users.remove(user.id);
            } catch (error) {
                console.error('Failed to remove reactions.');
            }
        }
    }
    if (messageReaction.message.channel.id == photoContestChannelId){
        //try {
            if (messageReaction.message.author.id == user.id){
                messageReaction.users.remove(user.id);
            } else {
                getAmountOfReactions(photoContestChannel, user)
                .then(count => {
                    if (count > 1){
                        messageReaction.users.remove(user.id);
                    }
                })
            }
           
        //} catch (error) {
            //messageReaction.users.remove(user.id);
            //console.error('Failed to handle vote!');
        //}
    }
});

client.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction.message.channel.id === "755911576510398504"){
        streamlinedGuild.members.cache.get(user.id).roles.remove(streamlinedGuild.roles.cache.get("755899895239540826"))
    }
});

client.guilds