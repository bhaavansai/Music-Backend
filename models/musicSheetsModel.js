const mongoose = require("mongoose");

const musicSheetsSchema = mongoose.Schema({
    heading: {
        type: String,
        required: [true, ""],
    },
    description: {
        type: String,
        required: [true, ""],
    },
    instrument: {
        type: String,
        required: [true, ""],
    },
    level: {
        type: String,
        required: [true, ""],
    },
    link: {
        type: String,
        required: [true, ""],
    }
});

module.exports = mongoose.model("music_sheet",musicSheetsSchema);