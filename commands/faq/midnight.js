const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "midnight",
    description: "Shows info on how to setup Midnight.",
    type: 'CHAT_INPUT',
    nonslash: true,
    options: [],
    
    messageRun: async (client, message, args, data) => {
        await message.delete()

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle('How do I setup Midnight?')
            .setURL("https://midnight.im/")
            .setColor(client.config.color)
            .setDescription(`- Go to their site: https://Midnight.IM and make an account.

            - Change language to english here https://midnight.im/misc/language
            
            - Activate key here https://midnight.im/payments/activate-key
            
            - You should see a new tab on the top called "Download loader" click it.
            If the download is failing, turn off your antivirus.
            
            - Open the loader and log in.
            
            - Press start it now then start GTA.
            
            - Make the menu appear with the Insert key.`)
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })

        return message.channel.send({ embeds: [embed] })
    },
};