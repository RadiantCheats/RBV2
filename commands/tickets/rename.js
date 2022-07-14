module.exports = {
    name: 'rename',
    description: 'Rename a ticket.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'name',
            description: 'The new name of the ticket.',
            type: 'STRING',
            required: true,
        }
    ],

    run: async (client, interaction, args, data) =>  {
        if (!data.guild.modules.tickets.collection[interaction.channel.id]) return interaction.error('This isn\'t a ticket channel.')

        try {
            await interaction.channel.setName(args[0])
            return interaction.success(`The name of this ticket has been set to ${args[0]}.`)
        } catch {
            return interaction.error('An error occurred while trying to rename the ticket.')
        }
    }
}