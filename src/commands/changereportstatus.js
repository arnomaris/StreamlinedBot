const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportstatus')
        .setDescription('Change the status of a bug report')
        .addStringOption(option =>
			option.setName('status')
				.setDescription('The new status of the report')
				.setRequired(true)
				.addChoices(
					{ name: 'Verified', value: 'Verified' },
					{ name: 'Information required', value: 'Information required' },
					{ name: 'Not a bug', value: 'Not a bug' },
					{ name: 'Roblox', value: 'Roblox' },
					{ name: 'Fixed', value: 'Fixed next update' },
					{ name: 'Fixed in future update', value: 'Fixed in future upd' },
					{ name: 'Fixed in new servers', value: 'Fixed in new servers' },
					{ name: 'Not fixing', value: 'Not fixing' },
				)),
    async execute(interaction) {
        if (interaction.channel.isThread()) {
            const status = interaction.options.getString('status');
            const embed = new EmbedBuilder()
            switch (status) {
                case 'Verified':
                    embed.setColor('#00FF00');
                    embed.setTitle('Bug Verified');
                    embed.setDescription('This bug has been verified by a member of staff, the bug will be fixed by a developer in a future update.');
                    break;
                case 'Information required':
                    embed.setColor('#FFFF00');
                    embed.setTitle('Information Required');
                    embed.setDescription('This bug requires more information before it can be fixed. Please provide more details.');
                    embed.addFields(
                        { name: 'Include the F9 screen', value: 'You can open the F9 menu by pressing F9 on your keyboard or by typing `\\console` in chat to open the F9 screen. Make sure to scrolldown and include the most recent information!' },
                        { name: 'Include images', value: 'If possible, include images of the bug in action. This will help us understand the issue better.' },
                        { name: 'Include steps to reproduce', value: 'If you can, include the steps to reproduce the bug. This will help us reproduce the issue.' }
                    );
                    break;
                case 'Not a bug':
                    embed.setColor('#FF0000');
                    embed.setTitle('Not a Bug');
                    embed.setDescription('This issue is not a bug but an intended behavior.');
                    break;
                case 'Roblox':
                    embed.setColor('#FF0000');
                    embed.setTitle('Roblox Issue');
                    embed.setDescription('This bug is caused by Roblox and cannot be fixed by the developers.');
                    break;
                case 'Fixed next update':
                    embed.setColor('#00FF00');
                    embed.setTitle('Bug Fixed');
                    embed.setDescription('This bug has been fixed and will be included in the next update.');
                    break;
                case 'Fixed in future upd':
                    embed.setColor('#00FF00');
                    embed.setTitle('Bug Fixed in Future Update');
                    embed.setDescription('This bug has been fixed and will be included in a future update.');
                    break;
                case 'Fixed in new servers':
                    embed.setColor('#00FF00');
                    embed.setTitle('Bug Fixed in New Servers');
                    embed.setDescription('This bug has been fixed and is live in new servers only.');
                    break;
                case 'Not fixing':
                    embed.setColor('#414141');
                    embed.setTitle('Not Fixing');
                    embed.setDescription('This bug is not significant enough to be fixed.');
                    break;
                default:
                    break;
            }

            if (embed) {
                await interaction.channel.send({ embeds: [embed] });
            }
            const tagId = interaction.channel.parent.availableTags.find(tag => tag.name === status).id
            interaction.channel.setAppliedTags([tagId]);
            await interaction.reply({ content: "Updated report status!", flags: MessageFlags.Ephemeral });
            interaction.reply()
        } else {
            interaction.reply({ content: "This command does not work in this channel!", flags: MessageFlags.Ephemeral })
        }
    }
};