const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "phx",
    description: "Shows info on how to setup Phantom-X.",
    type: 'CHAT_INPUT',
    nonslash: true,
    aliases: ["phantomx"],
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('PHX Links')
            .setColor(client.config.color)
            .setDescription("[Downloads](https://pastebin.com/raw/c54JVG21)\n[Installation Guide](https://docs.google.com/document/d/1k4_OU_fY9hmCXgI54DRfKJ1g9KJKPuZNhFWeVVeqIa4/edit?usp=sharing)")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};