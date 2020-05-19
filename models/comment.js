const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: String
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment