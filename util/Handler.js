const fs = require('fs');
const mongoose = require("mongoose");

module.exports = async (client) => {
    // Commands
    const cmdCategories = fs.readdirSync("./commands");
    for await (const category of cmdCategories) {
        const commands = fs
          .readdirSync(`./commands/${category}`)
          .filter((File) => File.endsWith(".js"));
        for await (const file of commands) {
            const command = await require(`../commands/${category}/${file}`);
            client.commands.set(command.name, command);
        }
        client.cmdcategories.push(category);
    }

    // Events
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith('.js'));
    
    for await (const file of eventFiles) {
        const event = await require(`../events/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
    }

    // Slash Commands
    const slashCategories = fs.readdirSync("./slashcommands").filter(file => !file.includes("settings"));
    const arrayOfSlashCommands = [];
    for await (const category of slashCategories) {
        const slashCommands = fs
          .readdirSync(`./slashcommands/${category}`)
          .filter((File) => File.endsWith(".js"));
        for await (const file of slashCommands) {
            const command = await require(`../slashcommands/${category}/${file}`);
            command.category = category;
            client.slashcommands.set(command.name, command);
            if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
            arrayOfSlashCommands.push(command);
        }
        client.slashcategories.push(category);
    }

    client.once("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands);
        console.log("Slash commands deployed.");
    });

    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
    }).then(() => console.log('Connected to MongoDB.'));
    client.db = mongoose.connection;
};