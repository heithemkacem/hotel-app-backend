//mongoDB
require('./config/db')
const errorHandler = require('./config/error-handler')
const app=require('express')()
const cors = require('cors')
const bodyParser=require('express').json
const routes= require('./routes')

app.use(errorHandler)   
//cors
app.use(cors())
//for accepting posts from data
app.use(bodyParser())
//registering routes
app.use(routes)

module.exports = app

