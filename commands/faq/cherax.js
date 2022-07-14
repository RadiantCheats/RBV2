const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "cherax",
    description: "Shows info on how to setup Cherax.",
    type: 'CHAT_INPUT',
    nonslash: true,
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('How do I setup Cherax?')
            .setURL("https://cherax.vip/")
            .setColor(client.config.color)
            .setDescription("Go over to the Cherax [website](https://cherax.vip/) and create an account. You will need to get your account on the forum approved by an administrator of Cherax (if you registered using a VPN), and seeing as this could take some time, we can only request you to be patient. Once you have your account successfully authenticated, go over to \"Purchase\", and then press the purple \"Purchase\" button on the right. Add Cherax to your cart, and then a button called \"Checkout\" will appear on the right, press it but enter the key you got from us as a coupon code, which essentially gives you a 100% off on this purchase. Afterwards, you should be able to download the mod menu!")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })

        return message.channel.send({ embeds: [embed] })
    },
};