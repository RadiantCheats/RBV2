const { MessageActionRow, MessageButton, MessageText } = require('discord.js');

module.exports = {
    name: 'ticketpanel',
    description: 'Send the ticket panel in a channel.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'channel',
            description: 'The channel to send it in.',
            type: 'CHANNEL',
            required: false
        }
    ],

    run: async (client, interaction, args, data) =>  {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        if (!channel.isText()) return interaction.error("You can only send the ticket panel in a text channel.");

        const embed = data.guild.modules.tickets.panel.embed
        if (!embed) return interaction.error("The ticket panel embed has not been set.");

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`ticketpanel-${interaction.guild.id}`)
                .setLabel("Create a ticket")
                .setEmoji('📩')
                .setStyle("PRIMARY")
        );

        if (data.guild.modules.tickets.panel.id) {
            
        }
        const msg = await channel.send({ embeds: [embed], components: [row] });
        data.guild.modules.tickets.panel.id = msg.id;
        data.guild.markModified("modules.tickets.panel.id");
        await data.guild.save();
        interaction.success("The ticket panel has been sent.");
    }
}