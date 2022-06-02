const permissionManager = require('./permissionManager.js')
const clientHandler = require('./../client.js')

permissionManager.configure('reset', {
	tiers: {
		'1': ['Event Manager', 'Lead Developer']
	},
	permissions: {
		'0': {channels: {}},
		'1': {},
	},
})


module.exports = async function(message) {
	let args = message.content.split(/[ ]+/)
	if (!permissionManager.hasPermissions(message, 'reset')) return
	message.reply("Restarting bot...")
		.then(msg => clientHandler.client.destroy())
		.then(() => clientHandler.client.login(process.env.DISCORD_TOKEN));
}