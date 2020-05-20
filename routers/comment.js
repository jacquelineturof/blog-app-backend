const express = require('express')
const moment = require('moment')

const Comment = require('../models/comment')

const { authenticate } = require('../middleware/authenticate')

const router = new express.Router()

router.post('/post/:id/comment', authenticate, async (req, res) => {
    const postId = req.params.id
    const ownerId = req.user._id
    const username = req.user.username
    const text = req.body.text
    const created = moment().format("MMMM Do YYYY")

    const newComment = new Comment({ postId, ownerId, username, text, created })

    try {
        await newComment.save()
        res.status(201).send({ message: 'Comment Created' })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.get('/post/:id/comment', async (req, res) => {
    const postId = req.params.id 

    try {
        const comments = await Comment.find({ postId })
        res.status(200).send({ comments })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.put('/comment/:id', authenticate, async (req, res) => {
    const commentId = req.params.id
    const updatedText = req.body.text 

    console.log(updatedText)
    try {
        const comment = await Comment.findById(commentId)

        if (comment.ownerId.toString() !== req.user._id.toString()) {
            throw new Error('You cannot edit this comment.')
        } else {
            comment.text = updatedText
            await comment.save()
            res.send({ message: 'Comment Updated' })
        }
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.delete('/comment/:id', authenticate, async (req, res) => {
    const commentId = req.params.id

    try {
        const comment = await Comment.findById(commentId)
        if (comment.ownerId.toString() !== req.user._id.toString()) {
            throw new Error('You cannot delete this comment.')
        } else {
            await Comment.findByIdAndDelete(commentId)
            res.send({ message: 'Comment Deleted' })
        }
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router