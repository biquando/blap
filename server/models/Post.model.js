const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new Schema(
    {
        username: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: Object, required: true },
    },
    { timestamps: true }
)

const Post = mongoose.model("Post", PostSchema)
module.exports = Post
