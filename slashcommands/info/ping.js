module.exports = {
    name: "ping",
    description: "Returns the latency of the bot.",
    type: 'CHAT_INPUT',
    options: [],
    
    run: async (client, interaction, args, data) => {
        return interaction.send({
            title: ":ping_pong: Pong!",
            description: `API Latency: ${client.ws.ping}ms`,
        });
    },
};