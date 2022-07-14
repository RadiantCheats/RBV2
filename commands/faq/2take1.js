const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "2take1",
    description: "Shows info on how to setup 2take1.",
    type: 'CHAT_INPUT',
    nonslash: true,
    aliases: ["2t1"],
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('How do I setup 2take1?')
            .setColor(client.config.color)
            .setDescription("Simply go over to the 2Take1 [website](https://2take1.menu/), and register with an account. Once you have successfully verified your account, head on over to \"My Account\" on the top right of the screen, and click on the \"Redeem a Code\" blue button on the bottom. Simply copy paste your key which you have purchased from us into the box that comes up, and afterwards you should be able to download the mod menu!")
            .setURL("https://2take1.menu/")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};