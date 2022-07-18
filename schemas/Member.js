const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    id: { type: String },
    gid: { type: String },
    warns: { type: Object, default: {
        count: 0,
        collection: {}
    }},
    other: { type: Object, default: {
        ticketrules: false,
        ticket: null,
        ticketban: {
            banned: false,
            until: null,
            forever: null
        }
    }},
})
// you can use monogodb compass to see the db easier ok

module.exports = mongoose.model("Member", memberSchema);