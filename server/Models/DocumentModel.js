const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentModel = new Schema({
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    secretKey: {
        type: String,
        required: true
    },

    AccessebleUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Filepath: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Document", DocumentModel);