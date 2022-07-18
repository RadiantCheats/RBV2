const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "reactionroles",
    description: "create the reaction roles message",

    run: async (client, interaction, args, data) => {
        const msg = await interaction.channel.send({ embeds: [new MessageEmbed().setTitle('Reaction Roles')] })
        data.guild.modules.reactionroles.message = msg.id;

        await data.guild.markModified('modules.reactionroles');
        await data.guild.save()
        interaction.reply({ ephemeral: true, content: "completed" })
    }
};