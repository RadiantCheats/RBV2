module.exports = {
    name: "settings",
    description: "Configure the bot's settings.",
    type: 'CHAT_INPUT',
    perms: ['MANAGE_GUILD'],
    options: [
        {
            name: "module",
            description: "The module to configure.",
            type: "STRING",
            required: true,
            choices: [
                { name: "Autorole", value: "autorole" },
                { name: "Ticket System", value: "ticket" },
                { name: "Ticket Rules", value: "ticketrules" },
            ]
        }
    ],
    
    run: async (client, interaction, args, data) => {
        const module = args[0];
        switch (module) {
            case "autorole": { return require('../settings/AutoRole')(client, interaction, data) }
            case "ticket": { return require('../settings/TicketSystem')(client, interaction, data) }
            case "ticketrules": { return require('../settings/TicketRules')(client, interaction, data) }
        }
    },
};