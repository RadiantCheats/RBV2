const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'warn',
    description: 'Warn a user.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to warn.',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the warn.',
            type: 'STRING',
            required: false
        }
    ],

    run: async (client, interaction, args, data) =>  {
        const member = await interaction.guild.members.cache.get(args[0]);
        const reason = args[1] || 'No reason provided';

        if (member.user.bot) return interaction.error('You can\'t warn a bot.');
        if (member === interaction.member) return interaction.error('You can\'t warn yourself.');
        if (!member.moderatable) return interaction.error('I can\'t warn this user.');
        if (member.roles.highest.position > interaction.member.roles.highest.position) return interaction.error('You can\'t warn this user.');

        let caseNum = ++data.member.warns.count;
        
        data.member.warns.collection[caseNum] = {
            reason: reason,
            moderator: interaction.member.id,
            date: Date.now()
        }
        data.member.markModified('warns');
        data.member.save();

        return interaction.success(`Warned ${member} for \`${reason}\`.`);
    }
}