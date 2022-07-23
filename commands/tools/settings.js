// Make choices & modules \\
const fs = require('fs');
const opts = [];
fs.readdirSync('./commands/settings').forEach(v => {
    opts.push({
        name: v.split(".")[0],
        value: v.split(".")[0].toLowerCase()
    })
})
// ---------------------- \\

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
            choices: opts
        }
    ],

    run: async (client, interaction, args, data) => {
        const module = opts.filter(v => v.value === args[0])[0];
        require(`../settings/${module.name}.js`)(client, interaction, data)
    },
};