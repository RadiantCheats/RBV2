const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "antivirus",
    description: "Shows info on antivirus flagging.",
    type: 'CHAT_INPUT',
    nonslash: true,
    aliases: ["virus", "av"],
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('My antivirus is saying that my menu is a virus!')
            .setColor(client.config.color)
            .setDescription("This is what is known as a 'false-positive'. Sometimes your menu will be flagged by your antivirus because of the way it interacts with your game. They hijack GTA V's process so that they can manipulate the game, allowing you to use the options that they feature. Genuine malware would use similar methods and processes to gather data or execute other malicious actions that may damage your PC, which is why your antivirus may not be able to tell the difference. To avoid further false-positives, you can either disable your antivirus, or add all menu files to your antivirus's exceptions. We can guarantee you that your menu is not a virus.")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};