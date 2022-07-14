const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "stand",
    description: "Shows info on how to setup Stand.",
    type: 'CHAT_INPUT',
    nonslash: true,
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('How do I setup Stand?')
            .setColor(client.config.color)
            .setDescription("First register an account at the [Stand website](https://stand.gg/account/register). Follow further instructions on the dashboard.")
            .setURL("https://stand.gg/")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};