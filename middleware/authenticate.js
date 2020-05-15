const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth')

    try {
        const user = await findByToken(token)
        if (!user) return Promise.reject()
        req.user = user
        req.token = token
        next()
    } catch (e) {
        return res.status(401).send(e)
    }
}

const findByToken = async function(token) {
    let decoded

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch(e) {
      return Promise.reject()
    }

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token
    })
}

const findByCredentials = async (username, password) => {
    try {
        const user = await User.findOne({ username  })

        if (!user) {
            throw new Error('Unable to login')
        }
    
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }
        return user

    } catch (e) {
        throw new Error(e.message)
    }
}

/**
 * Generate an auth token for the user 
 * add token to tokens array
 * use concat so we don't mutate the original array
 * return the token
 */
generateAuthToken = async function (user) {
    const token = jwt.sign(
        { _id: user._id.toString() }, 
        process.env.JWT_SECRET
    )

    // Clear old tokens before saving new token
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

module.exports = { authenticate, findByCredentials, generateAuthToken }