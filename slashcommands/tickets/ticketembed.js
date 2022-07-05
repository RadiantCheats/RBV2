const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ticketembed',
    description: 'Configure the embed for the ticket panel.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'title',
            description: 'Title of the panel embed.',
            type: 'STRING',
            required: false
        },
        {
            name: 'description',
            description: 'Description of the panel embed.',
            type: 'STRING',
            required: false
        },
        {
            name: 'color',
            description: 'Color of the panel embed.',
            type: 'STRING',
            required: false
        },
    ],

    run: async (client, interaction, args, data) =>  {
        const title = args[0];
        const description = args[1];
        const color = args[2];

        const embed = new MessageEmbed()
        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (color) embed.setColor(color);

        data.guild.modules.tickets.panel.embed = embed;
        data.guild.markModified("modules.tickets.panel.embed");
        await data.guild.save();
        interaction.success("The ticket panel embed has been updated.");
    }
}