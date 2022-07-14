module.exports = {
    name: "reload",
    description: "Reloads the bot's commanmds.",
    type: 'CHAT_INPUT',
    options: [],
    
    run: async (client, interaction, args, data) => {
        for await (const command of client.commands) {
            delete require.cache[require.resolve(`../${command[1].category}/${command[1].name}.js`)];
            const newcmd = await require(`../${command[1].category}/${command[1].name}.js`);
            await client.commands.set(newcmd.name, Object.assign(newcmd, { category: command[1].category }));
        }
        await interaction.success("Reloaded all commands.");
    },
};