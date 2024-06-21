import { getVote } from '../database/photocontestHandler.js';

export const data = {
    name: 'voted'
};
export async function execute(interaction) {
    let voteId = await getVote(interaction.user.id, interaction.guild.id);
    if (voteId) {
        let photocontestChannel = interaction.guild.channels.cache.find(channel => channel.name === 'photo-contest');
        interaction.reply({ content: `You voted for: https://discord.com/channels/${interaction.guild.id}/${photocontestChannel.id}/${voteId}`, ephemeral: true });
    } else {
        interaction.reply({ content: 'You did not vote for anyone yet!', ephemeral: true });
    }
}