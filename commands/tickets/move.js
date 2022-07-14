module.exports = {
    name: 'move',
    description: 'Change a ticket\'s priority.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'priority',
            description: 'The new priority of the ticket.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Low', value: 'low' },
                { name: 'Medium', value: 'medium' },
                { name: 'High', value: 'high' },
            ]
        }
    ],

    run: async (client, interaction, args, data) =>  {
        if (!data.guild.modules.tickets.collection[interaction.channel.id]) return interaction.error('This isn\'t a ticket channel.')

        switch (args[0]) {
            case 'low': {
                const category = data.guild.modules.tickets.category;
                await interaction.channel.setParent(category, { lockPermissions: false });
                return interaction.success(`This ticket has been moved to low priority.`);
            }
            case 'medium': {
                const category = await interaction.guild.channels.cache.find(c => c.name === 'middle' && c.type === 'GUILD_CATEGORY');
                if (!category) return interaction.error('Could not find the middle priority category.');
                await interaction.channel.setParent(category, { lockPermissions: false });
                return interaction.success(`This ticket has been moved to medium priority.`);
            }
            case 'high': {
                const category = await interaction.guild.channels.cache.find(c => c.name === 'high' && c.type === 'GUILD_CATEGORY');
                if (!category) return interaction.error('Could not find the high priority category.');
                await interaction.channel.setParent(category, { lockPermissions: false });
                return interaction.success(`This ticket has been moved to high priority.`);
            }
        }
    }
}