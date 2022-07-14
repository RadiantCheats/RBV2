const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
    name: 'close',
    description: 'Close a ticket.',
    type: 'CHAT_INPUT',
    options: [],

    run: async (client, interaction, args, data) =>  {
        const mod = data.guild.modules.tickets;

        if (!mod.collection[interaction.channel.id]) return interaction.error('This isn\'t a ticket channel.')
        if (mod.collection[interaction.channel.id].closed) return interaction.error(`This ticket has already been closed.`, true)
    
        const memData = await client.getMemberData(interaction.guild.id, mod.collection[interaction.channel.id].owner)
        memData.other.ticket = null;
        memData.markModified("other.ticket");
        await memData.save();

        mod.collection[interaction.channel.id].closed = true;
        data.guild.markModified('modules.tickets');
        await data.guild.save();
        
        const member = interaction.guild.members.cache.get(mod.collection[interaction.channel.id].owner);

        await interaction.channel.permissionOverwrites.edit(member, [
            {
                id: member.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL],
            }
        ]).catch((e) => {
            return interaction.error('An error occurred while closing the ticket.')
        });

        const embed = new MessageEmbed({
            author: {
                name: `${interaction.user.username}`,
                icon_url: `${interaction.user.displayAvatarURL()}`,
            },
            description: `Ticket closed by <@!${interaction.user.id}>. It is now only viewable by staff.`,
            color: client.config.color
        })

        await interaction.reply({
            embeds: [embed], components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('SUCCESS')
                            .setCustomId(`ticketcancel`)
                            .setLabel('Open')
                            .setEmoji('🔓'),
                        new MessageButton()
                            .setStyle('DANGER')
                            .setCustomId(`ticketdelete`)
                            .setLabel('Delete')
                            .setEmoji('🗑'),
                        new MessageButton()
                            .setStyle('SECONDARY')
                            .setCustomId(`tickettranscript`)
                            .setLabel('Transcript')
                            .setEmoji('🗄')
                )]
        });
    }
}