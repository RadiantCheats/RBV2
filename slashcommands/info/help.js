const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require('discord.js');

module.exports = {
    name: "help",
    description: "Show the help menu.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "command",
            description: "The command to show help for.",
            type: "STRING",
            required: false,
        }
    ],
    
    run: async (client, interaction, args, data) => {
        if (args[0]) {
            const command = client.slashcommands.get(args[0]);
            if (!command) return interaction.reply({ content: `Command \`${args[0]}\` not found.`, ephemeral: true });
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${command.category.charAt(0).toUpperCase() + command.category.slice(1)} Command: ${command.name}`)
                .setDescription(`Name: \`${command.name}\`\nDescription: \`${command.description}\`\nCategory: \`${command.category}\`\nPermissions: \`${!command.permissions ? "None" : command.permissions}\``)
            return interaction.reply({ embeds: [embed] });
        }
        const menu = new MessageSelectMenu()
            .setCustomId('helpmenu')
            .setPlaceholder('Select a category')
            .addOptions(
                await client.slashcategories.map((category) => {
                    return {
                        label: `${client.customEmojis[category]} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                        value: `${category}`,
                        description: `View all commands in the ${category.charAt(0).toUpperCase() + category.slice(1)} category.`,
                    }
                })
            )
        const row = new MessageActionRow().addComponents(menu);
        const rowTwo = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Our Website')
                .setStyle('LINK')
                .setURL(client.config.websiteUrl),
            new MessageButton()
                .setLabel('FAQ')
                .setStyle('LINK')
                .setURL(client.config.faqUrl),
        );
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setDescription("Click below to view all commands in a category, or use `/help {command}` to view info on a particular command!")
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const msg = await interaction.followUp({ embeds: [embed], components: [row, rowTwo] });
    
        const filter = (i) => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 60000 });
    
        collector.on('collect', async (i) => {
            const [cat] = i.values;
            const category = client.slashcategories.find((category) => category === cat);

            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
                .addFields(
                    await client.slashcommands.filter((cmd) => cmd.category === category).map((command) => {
                        return {
                            name: `\`${command.name}\``,
                            value: command.description,
                            inline: true,
                        }
                    })
                )

            i.update({ embeds: [embed], components: [row, rowTwo] });
        })

        collector.on('end', async () => {
            menu.setDisabled(true)
            msg.edit({ components: [row, rowTwo] });
        })
    }
}