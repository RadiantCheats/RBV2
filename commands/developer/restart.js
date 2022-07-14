module.exports = {
    name: "restart",
    description: "Restarts the bot.",
    type: 'CHAT_INPUT',
    options: [],
    
    run: async (client, interaction, args, data) => {
        await interaction.success("Restarting...");
        return process.exit();
    },
};