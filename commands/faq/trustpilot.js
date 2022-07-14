const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "trustpilot",
    description: "Sends our trustpilot link.",
    type: 'CHAT_INPUT',
    nonslash: true,
    aliases: ["tp", "review"],
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('Please rate us!')
            .setColor(client.config.color)
            .setURL('https://www.trustpilot.com/evaluate/gtacheats.net')
            .setDescription('Please leave a review at https://www.trustpilot.com/evaluate/gtacheats.net if you have time it would be greatly appreciated! ❤️')
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};