import { REST, Routes } from 'discord.js';
import 'dotenv/config'
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const commands = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsPath = join(__dirname, './commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

for (const file of commandFiles) {
	await import(`./commands/${file}`).then(command => {
		commands.push(command.data.toJSON());
	});
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();