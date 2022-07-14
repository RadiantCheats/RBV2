const fs = require('fs');
const mongoose = require("mongoose");

module.exports = async (client) => {

    // Events
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith('.js'));
    
    for await (const file of eventFiles) {
        const event = await require(`../events/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
    }

    // Commands
    const categories = fs.readdirSync("./commands").filter(file => !file.includes("settings"));
    const cmdArr = [];
    for await (const category of categories) {
        const commands = fs
          .readdirSync(`./commands/${category}`)
          .filter((File) => File.endsWith(".js"));
        for await (const file of commands) {
            const command = await require(`../commands/${category}/${file}`);
            command.category = category;
            client.commands.set(command.name, command);
            if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
            if (!command?.nonslash) cmdArr.push(command);
        }
        client.categories.push(category);
    }

    client.once("ready", async () => {
        await client.application.commands.set(cmdArr);
        console.log("Slash commands deployed.");
    });

    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
    }).then(() => console.log('Connected to MongoDB.'));
    client.db = mongoose.connection;
};