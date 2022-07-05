const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    id: { type: String },
    gid: { type: String },
    other: { type: Object, default: {
        ticket: null,
        ticketban: {
            banned: false,
            until: null,
            forever: null
        }
    }},
})

module.exports = mongoose.model("Member", memberSchema);