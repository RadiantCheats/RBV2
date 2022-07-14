const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: 'Get the avatar of a user.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to get the avatar of.',
            type: 'USER',
        }
    ],

    run: async (client, interaction, args, data) =>  {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setImage(user.displayAvatarURL({ dynamic: true }))
            .setColor(client.config.color)
        return interaction.reply({ embeds: [embed] })
    }
}