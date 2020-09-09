var discord = require('discord.js');
var mysql = require('mysql');
var client = new discord.Client();
var token = 'MzEyOTIxODY0MDA1NDg0NTQ1.DmNMMQ.uhN0FtBvisVROznbrGleGBAXEiU'
var prefix = "!"

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
  });

var photoContestChannel = '742420136488599653'

client.login(token)

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(" fetch with doggo cows")
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

function pluck(array){
    return array.map(function(item) { return item['name']; })
}

function hasRole(members, role){
    if(pluck(members.roles.cache).includes(role)){
        return true;
    } else {
        return false;
    }
}

function isAdmin(message){
	if(
		hasRole(message.member,"Lead Developer") ||
		hasRole(message.member,"Streamlined Owner")
		){

		return true;
	} else {
		return false;
	}
}

function isCommand(command, message){
	var command = command.toLowerCase();
	var content = message.content.toLowerCase();
	return content.startsWith(prefix + command);
}

client.on('message', (message) => {
    if (message.channel.id == photoContestChannel){
        message.react('👍')
        .catch(console.error);
    };
    //if(isAdmin(message)){
        //if(isCommand("cheese", message)){
            //var generalChannel = client.channels.cache.find(channel => channel.name === "general")
            //generalChannel.send("I like cheese")
        //;
    //};
});
