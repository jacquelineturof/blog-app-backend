const express = require('express')

const User = require('../models/user')

const { authenticate, findByCredentials, generateAuthToken, findByToken } = require('../middleware/authenticate')

const router = new express.Router()

// Register
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    console.log('user: ', user)
    try {
        await user.save()
        res.status(200).send({ user })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// Login
router.post('/user/login', async (req,res) => {
    console.log('login route')
    const username = req.body.username
    const password = req.body.password
    console.log(username)
    console.log(password)
    try {
        const user = await findByCredentials(username, password)
        console.log('user: '. user)
        const token = await generateAuthToken(user)

        res.send({ 
            username: user.username,
            isAdmin: user.isAdmin,
            token 
        })
    } catch (e) {
        res.status(401).send(e.message)
    }
})

// Logout
router.delete('/user/login', authenticate, async (req, res) => {
    try {
        req.user.tokens = [] // this will log out all devices, not sure if I want to do this?
        await req.user.save()
        res.send() // Don't care about sending any thing back.
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router