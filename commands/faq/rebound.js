const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "rebound",
    description: "Shows info on how to setup Rebound.",
    type: 'CHAT_INPUT',
    nonslash: true,
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('How do I setup Rebound?')
            .setColor(client.config.color)
            .setDescription("First register an account at the [Rebound website](https://reboundcheats.org/). Next, follow further instructions [here](https://reboundcheats.org/threads/rebound-loader-how-to-use-a-thread.35/).")
            .setURL("https://reboundcheats.org/")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};