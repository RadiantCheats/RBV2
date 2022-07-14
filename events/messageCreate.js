module.exports = {
    name: "messageCreate",
    async run (client, message) {
        const prefix = (await client.getGuildData(message.guild.id)).prefix;
        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.commands.find((a) => a.aliases && a?.aliases.includes(cmd));

        if (!message.content.startsWith(prefix) || !command || message.author.bot || message.channel.type.toLowerCase() == 'dm') return;

        try {
            command.messageRun(client, message, args, {
                guild: await client.getGuildData(message.guild.id),
                user: await client.getUserData(message.author.id),
                member: await client.getMemberData(message.guild.id, message.author.id),
            })
        } catch {}
    }
} 