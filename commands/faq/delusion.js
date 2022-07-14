const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "delusion",
    description: "Shows info on how to setup Delusion.",
    type: 'CHAT_INPUT',
    nonslash: true,
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('How do I setup Delusion?')
            .setURL("https://delusion.gg/")
            .setColor(client.config.color)
            .setDescription("Go to their site [here](https://delusion.gg/). Then, press the login button at the top right.")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })

        return message.channel.send({ embeds: [embed] })
    },
};