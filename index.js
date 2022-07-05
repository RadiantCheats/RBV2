require('dotenv').config()
const { Client, Collection } = require('discord.js');
const config = process.env.DEV ? require('./dev-config') : require('./config');

require('./util/ConfigChecker')(config);

class Radiant extends Client {
    constructor() {
        super({ intents: 32767 });
        this.commands = new Collection();
        this.slashcategories = [];
        this.cmdcategories = [];
        this.slashcommands = new Collection();
        this.commands = new Collection();

        this.config = config;
        this.customEmojis = require('./assets/emojis');

        this.userData = require('./schemas/User');
        this.memberData = require('./schemas/Member');
        this.guildData = require('./schemas/Guild');

        this.cache = {};
        this.cache.users = new Collection();
        this.cache.members = new Collection();
        this.cache.guilds = new Collection();

        this.#Start();
    }
    async #init() {
        require("./util/Extenders");
        require("./util/Handler")(this);
        require("./servers/standalone-auth")(this);
    }
    async #Start() {
        await this.#init();
        await this.login(process.env.DEV ? process.env.DEVTOKEN : process.env.TOKEN);
    }
    
    async getUserData(id) {
        let userData = await this.cache.users.get(id) || await this.userData.findOne({ id });
        if (!userData) {
            userData = await new this.userData({ id }).save();
        }
        await this.cache.users.set(id, userData);
        return userData;
    }
    async getMemberData(gid, uid) {
        let memberData = await this.cache.members.get(`${gid}-${uid}`) || await this.memberData.findOne({ gid, id: uid });
        if (!memberData) {
            memberData = await new this.memberData({ gid, id: uid }).save();
        }
        await this.cache.members.set(`${gid}-${uid}`, memberData);
        return memberData;
    }
    async getGuildData(id) {
        let guildData = await this.cache.guilds.get(id) || await this.guildData.findOne({ id }); 
        if (!guildData) {
            guildData = await new this.guildData({ id }).save();
        }
        await this.cache.guilds.set(id, guildData);
        return guildData;
    }

    async resolveGuild(id) { return this.guilds.cache.get(id) }
    async resolveRole(gid, rid) {const guild = await this.resolveGuild(gid); if (!guild) return null; return guild.roles.cache.get(rid) }
    async resolveChannel(gid, cid) { const guild = await this.resolveGuild(gid); if (!guild) return null; return guild.channels.cache.get(cid) }
}

const client = new Radiant();

client.on("disconnect", () => console.log("Bot is disconnecting..."))
    .on("reconnecting", () => console.log("Bot reconnecting..."))
	.on("error", (e) => console.log(e))
	.on("warn", (w) => console.log(w));

process.on("unhandledRejection", (err) => {
	console.error(err);
});

module.exports = Radiant;