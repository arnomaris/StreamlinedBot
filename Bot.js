var discord = require('discord.js');
var client = new discord.Client();
var token = 'MzEyOTIxODY0MDA1NDg0NTQ1.DmNMMQ.uhN0FtBvisVROznbrGleGBAXEiU'
var pastebintoken = "b85a1fde3f69f6c3f7353c234e13f666"
var prefix = "!"

var photoContestChannel = '742420136488599653'
var streamlinedGuild
var suggestionRules

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
});

function pluck(array){
    return array.map(function(item) { return item['name']; })
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


client.on('message', (message) => {
    if (message.channel.id == photoContestChannel){
        message.react('👍')
        .catch(console.error);
    };
    if(isAdmin(message)){
        if(isCommand("cheese", message)){
            const generalChannel = client.channels.cache.find(channel => channel.name === "general")
            generalChannel.send("I like cheese")
        };
    };
});


client.on('messageReactionAdd', (messageReaction, user) => {
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
});

client.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction.message.channel.id === "755911576510398504"){
        streamlinedGuild.members.cache.get(user.id).roles.remove(streamlinedGuild.roles.cache.get("755899895239540826"))
    }
});

client.guilds