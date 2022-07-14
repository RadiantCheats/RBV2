module.exports = {
    name: 'hide',
    description: 'Hide a ticket to your position.',
    type: 'CHAT_INPUT',
    options: [],

    run: async (client, interaction, args, data) =>  {
        const mod = data.guild.modules.tickets;
        if (!mod.collection[interaction.channel.id]) return interaction.error('This isn\'t a ticket channel.')

        let rank = "staff";

        if (interaction.member.permissions.has('BAN_MEMBERS')) rank = "mod";
        if (interaction.member.permissions.has('MANAGE_CHANNELS')) rank = "srmod";
        if (interaction.member.permissions.has('MANAGE_GUILD')) rank = "admin";
        if (interaction.member.permissions.has('ADMINISTRATOR')) rank = "manager";

        switch (rank) {
            case "staff": {
                return interaction.error(`You must be at least a mod to hide tickets.`, true);
            }
            case "mod": {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.get(mod.staff), {
                    VIEW_CHANNEL: false
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Moderation"), {
                    VIEW_CHANNEL: true
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Senior Moderation"), {
                    VIEW_CHANNEL: true
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Administration"), {
                    VIEW_CHANNEL: true
                });
                return interaction.success(`This ticket has been hidden to only mods and above.`, true);
            }
            case "srmod": {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.get(mod.staff), {
                    VIEW_CHANNEL: false
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Senior Moderation"), {
                    VIEW_CHANNEL: true
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Administration"), {
                    VIEW_CHANNEL: true
                });
                return interaction.success(`This ticket has been hidden to only senior mods and above.`, true);
            }
            case "admin": {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.get(mod.staff), {
                    VIEW_CHANNEL: false
                });
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.find((r) => r.name === "Administration"), {
                    VIEW_CHANNEL: true
                });
                return interaction.success(`This ticket has been hidden to only admins and above.`, true);
            }
            case "manager": {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.cache.get(mod.staff), {
                    VIEW_CHANNEL: false
                });
                return interaction.success(`This ticket has been hidden to only managers.`, true);
            }
        }
    }
}