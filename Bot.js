var discord = require('discord.js');
var client = new discord.Client();
var token = 'MzEyOTIxODY0MDA1NDg0NTQ1.DmNMMQ.uhN0FtBvisVROznbrGleGBAXEiU'

var photoContestChannel = '742420136488599653'
client.login(token)


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(" fetch with doggo cows")
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

client.on('message', (message) => {
    if (message.channel.id == photoContestChannel){
        message.react('👍')
        .catch(console.error);
    };
});
