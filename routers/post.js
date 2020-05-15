const express = require('express')
const moment = require('moment')

const Post = require('../models/post')

const router = new express.Router()

router.post('/post', async (req, res) => {
    const post = new Post(req.body)
    const now = moment().format("MMMM Do YYYY")
    post.created = now

    try {
        await post.save()
        res.status(201).send({ message: 'Post Created' })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) throw new Error('Post Not Found')
        res.status(200).send({ post })
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
})

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({ })
        res.send({ posts })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router