module.exports = {
    name: "ready",
    async run(client) {
        console.log(`${client.user.tag} is up and ready to go!`);
    }
}