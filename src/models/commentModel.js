const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
});
const comment = mongoose.model("comment", commentSchema);
module.exports = comment;