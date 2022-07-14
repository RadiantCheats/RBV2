const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "getkey",
    description: "Shows info on how to get your key.",
    type: 'CHAT_INPUT',
    nonslash: true,
    aliases: ["key"],
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setTitle('How do I get my key?')
            .setColor(client.config.color)
            .setDescription("You can find your key instantly on our website when you make the purchase. Click on your name towards the top right, then click on \"My Profile\" and navigate to \"Order History and Details\". Click the PDF icon to the right, and then open the PDF that got downloaded and your key should be located at the end of a paragraph towards the bottom. However, you also get the key in your email as well, just be sure to check your spam/trash folders!")
            .setURL("https://radiantcheats.net/index.php?controller=history")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        return message.channel.send({ embeds: [embed] })
    },
};