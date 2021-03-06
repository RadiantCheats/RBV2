const PermsChecker = require('../util/PermsChecker');

module.exports = {
    name: "interactionCreate",
    async run (client, interaction) {
        const data = {
            guild: await client.getGuildData(interaction.guild.id),
            user: await client.getUserData(interaction.user.id),
            member: await client.getMemberData(interaction.guild.id, interaction.user.id),
        }
        // Slash Command Handling
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.followUp({ content: "An error has occurred using this command." });

            if (!await PermsChecker(interaction, cmd)) return;

            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
            try {
                cmd.run(client, interaction, args, data);
            } catch (error) {
                console.error(error);
                return interaction.followUp({ content: "An error has occurred using this command." });
            }
        }

        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.commands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

        // Modal Handling
        if (interaction.isModalSubmit()) {
            // Ticket Reason
            if (interaction.customId.startsWith("ticketreason")) return require('./modules/TicketSystem')(client, interaction, data);
        }

        // Button Handling
        if (interaction.isButton()) {
            // Tickets
            if (interaction.customId.startsWith("ticket")) return require('./modules/TicketSystem')(client, interaction, data);
        }
    }
}