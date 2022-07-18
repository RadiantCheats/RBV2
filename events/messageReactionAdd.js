module.exports = {
    name: 'messageReactionAdd',
    async run(client, reaction, user) {
        const data = {
            guild: await client.getGuildData(reaction.message.guildId),
            user: await client.getUserData(user.id),
            member: await client.getMemberData(reaction.message.guildId, user.id),
        }
        const ro = data.guild.modules.reactionroles;
        if (reaction.message.id === ro.message) {
            require('./modules/ReactionRoles')(client, data, true, reaction, user)
        }
    }
}