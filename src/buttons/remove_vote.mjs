import { getVote, deleteVote } from '../database/photocontestHandler.mjs'

export const data = {
    name: 'remove_vote'
}
export async function execute(interaction) {
    let voteId = await getVote(interaction.user.id, interaction.guild.id)
    if (voteId) {
        deleteVote(interaction.user.id, voteId, interaction.guild.id)
        interaction.reply({ content: 'Successfully deleted your vote', ephemeral: true })
    } else {
        interaction.reply({ content: 'You did not vote for anyone yet!', ephemeral: true })
    }
}