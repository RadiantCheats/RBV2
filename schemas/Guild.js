const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const config = require("../config");

const guildSchema = new mongoose.Schema({
    id: { type: String },
    prefix: { type: String, default: '!' },
    modules: { type: Object, default: {
        autorole: {
            enabled: false,
            role: null
        },
        tickets: {
            panel: {
                id: null,
                channel: null,
                embed: (new MessageEmbed().setTitle("Support Tickets").setDescription("Feel free to make a ticket to get in touch with Staff in private, or to seek help regarding your purchase. We will be more than happy to help you!").setColor(config.color)),
            },
            rules: {
                enabled: false,
                channel: null,
                id: null,
            },
            staff: null,
            category: null,
            transcriptChannel: null,
            count: 0,
            collection: { type: Object, default: {} },
        },
        reactionroles: {
            enabled: false,
            message: null,
            roles: []
        }
    }},
})

module.exports = mongoose.model("Guild", guildSchema);