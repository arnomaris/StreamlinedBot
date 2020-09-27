const discord = require('discord.js')
const roblox = require('roblox-js');
const express = require('express')
const bodyParser = require('body-parser')
const nitroPlayers = require("./models/player.model.js")

const client = new discord.Client();
const app = express();

const token = 'MzEyOTIxODY0MDA1NDg0NTQ1.WRb1Mg.r-X5e-sSSVuetD8k4ojIftbrGUM'
const pastebintoken = "b85a1fde3f69f6c3f7353c234e13f666"
const prefix = "!"

const photoContestChannel = '742420136488599653'
const suggestionChannel = '565445147324579851'

var streamlinedGuild
var suggestionRules

client.login(token)

// mysql database
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "Hi" });
});
require("./routes/player.routes.js")(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}.')
});

nitroPlayers.getAll((err, data) => {
    if (err)
        console.error(err.message || "Some error occurred while retrieving players.")
    else 
        console.log(data)
});

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
        .catch(console.error)
    } else if (message.channel.id == suggestionChannel){
        message.react('👍')
            .then(message.react('👎'))
            .catch(console.error)
    };
    if(isAdmin(message)){
        if(isCommand("cheese", message)){
            const generalChannel = client.channels.cache.find(channel => channel.name === "general")
            generalChannel.send("I like cheese")
        };
    };
    if(isCommand("bindnitro", message)){
        if(hasRole(message.member, "Nitro Booster")){
            var args = message.content.split(/[ ]+/)
            if (args[1]){
                roblox.getIdFromUsername(args[1])
                    .then(id => {
                        message.channel.send('I found this player, is this you? Reply with "yes" if this is you. Command will time out after 1 minute')
                            .then(function(){
                                var messageEmbed = new discord.MessageEmbed()
                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' + id + '&width=110&height=110&format=png')
                                    .setTitle(args[1])
                                    .setURL('https://www.roblox.com/users/' + id + '/profile')
                                    .addFields(
                                        {name: 'Username', value: args[1], inline: true},
                                        {name: 'UserId', value: id, inline: true},
                                    )
                                message.channel.send(messageEmbed)
                                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000, errors: ['time']})
                                    .then(function(collected){
                                        if (collected.first().content.toLowerCase() == 'yes') {
                                            message.reply('binding your profile...')
                                        } else {
                                            message.reply(' successfully cancelled bind!')
                                        }
                                    })
                                    .catch(() => {
                                        message.reply("I didn't receive a confirmation after a minute! Please use !bindnitro again if you want to restart.")
                                    })
                            })
                    })
                    .catch(err =>{
                        message.reply('Could not find ' + args[1] + 'on Roblox!')
                    })
            } else {
                message.reply("You forgot to include your username!")
            }
        }
    }
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