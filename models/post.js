const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created: {
        type: String
    },
    category: {
        type: String,
        required: true
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post