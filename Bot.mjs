import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { connect } from './src/database/connection.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsPath = join(__dirname, './src/commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

for (const file of commandFiles) {
	await import(`./src/commands/${file}`).then(command => {
		client.commands.set(command.data.name, command);
	});
}

client.buttons = new Collection();
const buttonsPath = join(__dirname, './src/buttons');
const buttonFiles = readdirSync(buttonsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

for (const file of buttonFiles) {
	await import(`./src/buttons/${file}`).then(button => {
		console.log(button)
		client.buttons.set(button.data.name, button);
	});
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error)
		if (interaction.deferred)
			await interaction.editReply({ content: 'There was an error while executing this command!' })
		else if (interaction.replied)
			await interaction.editReply({ content: 'There was an error while executing this command!' })
		else
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return

	const button = interaction.client.buttons.get(interaction.customId);
	
	if (!button) return
	try {
		await button.execute(interaction);
	} catch (error) {
		console.error(error)
		if (interaction.deferred)
			await interaction.editReply({ content: 'There was an error while executing this button!' })
		else if (interaction.replied)
			await interaction.edit({ content: 'There was an error while executing this button!' })
		else
			await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true })
		
	}
})

client.on('messageCreate', async message => {
    if(message.author.bot) return

    if (message.channel.name == 'creations'){
        if (message.attachments.size || message.embeds.length) {
            message.react('👍').catch((err) => {})
        } else {
            await message.delete().catch((err) => {})
			console.log(message.member.dmChannel)
			if (!message.member.dmChannel) {
				await message.member.createDM()
			}
			if (message.member.dmChannel)
				message.member.dmChannel.send(`Your message in creations was removed due to not containing any images/creations. If you wish to give feedback on someone's post you can do it in the dedicated thread.`).catch(err => {})
        }
    }
})

client.login(process.env.DISCORD_TOKEN);
connect()

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});