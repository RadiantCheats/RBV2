const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'warnings',
    description: 'Check the warnings of a user.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to check the warnings of.',
            type: 'USER',
            required: true
        },
    ],

    run: async (client, interaction, args, data) =>  {
        const member = await interaction.guild.members.cache.get(args[0]);
        const count = data.member.warns.count;
        const collection = data.member.warns.collection;

        if (count === 0) return interaction.success("This user has no warnings.");
    
        const embed = new MessageEmbed()
            .setTitle(`${member.user.username}'s warnings`)
            .setFooter({ text: "Total warnings: " + count })
            .setColor(client.config.color)

        let description = "";
        for (const warn in collection) {
            description += `> **ID:** ${warn}\n`
            description += `> **Moderator:** <@${collection[warn].moderator}>\n`
            description += `> **Reason:** ${collection[warn].reason}\n\n`
        }
        embed.setDescription(description)

        return interaction.reply({ embeds: [embed]})
    }
}