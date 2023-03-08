require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

// DataBase Connection
require('./src/db')
const { getListOfInbounds } = require('./src/controllers/list')

// Express app
const app = express()

// Middlewares and configs
app.use(bodyParser.json())

// Routes
app.use('/', require('./src/routes'))

// App running
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`)
})

// TODO create cron job each 30day to update hosts sessions
