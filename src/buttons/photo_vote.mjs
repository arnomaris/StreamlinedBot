import { getEntry, getVote, updateVote, setVote } from '../database/photocontestHandler.js';
import { getSetting } from '../database/settingHandler.js';

export const data = {
    name: 'photo_vote'
};
export async function execute(interaction) {
    let votingOpen = await getSetting('voting', interaction.guild.id).catch(err => {
        interaction.reply({ content: 'There was an error while registering your vote!', ephemeral: true });
    });
    if (votingOpen === 'true') {
        let userId = interaction.user.id;
        let messageId = interaction.message.id;
        if (!(await getEntry(messageId, interaction.guild.id) == userId)) {
            getVote(userId, interaction.guild.id).then(async (value) => {
                if (value) {
                    updateVote(userId, messageId, interaction.guild.id);
                    await interaction.reply({ content: 'Changed your vote successfully', ephemeral: true });
                } else {
                    setVote(userId, messageId, interaction.guild.id);
                    await interaction.reply({ content: 'Registered your vote', ephemeral: true });
                }
            }).catch(err => {
                interaction.reply({ content: 'There was an error while registering your vote!', ephemeral: true });
            });
        } else {
            interaction.reply({ content: 'You can not vote for yourself!', ephemeral: true });
        }
    } else {
        interaction.reply({ content: 'Voting is closed!', ephemeral: true });
    }
}