import { clearEntries, clearVotes } from '../database/photocontestHandler.js';
import { updateSetting } from '../database/settingHandler.js';

export const data = {
    name: 'reset_contest'
};
export async function execute(interaction) {
    await interaction.deferReply(interaction.guild.id);
    clearEntries(interaction.guild.id);
    clearVotes(interaction.guild.id);

    let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
    let amountOfMessages = 1;

    while (amountOfMessages > 0) {
        try {
            let messages = await photocontestChannel.bulkDelete(100, true);
            amountOfMessages = messages.length;
        } catch (error) {
            interaction.editReply('I experienced an error while clearing #photo-contest\n```\n' + error + '\n```');
            break;
        }
    }
    updateSetting('photocontest', false, interaction.guild.id);
    updateSetting('voting', false, interaction.guild.id);
    await interaction.editReply('Successfully cleared the photo contest, start a new one with `/managecontest open`');
}