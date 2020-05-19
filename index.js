require('./db/mongoose')

const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./middleware/cors')

const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const commentRouter = require('./routers/comment')

const PORT = process.env.PORT || 3001
const app = express()

app.use(bodyParser.json())
app.use(cors)
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)

app.listen(PORT, () => console.log('App server up and running'))