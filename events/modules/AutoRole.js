module.exports = async (client, member, data) => {
    const role = await client.resolveRole(member.guild.id, data.guild.modules.autorole.role);
    if (role) {
        try {
            return await member.roles.add(role)
        } catch {}
    }
}