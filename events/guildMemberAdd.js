module.exports = {
    name: "guildMemberAdd",
    async run (client, member) {
        const data = {
            guild: await client.getGuildData(member.guild.id),
            user: await client.getUserData(member.user.id),
            member: await client.getMemberData(member.guild.id, member.user.id),
        }

        // Autorole Module
        if (data.guild.modules.autorole.enabled) return require('./modules/AutoRole')(client, member, data);
    }
}