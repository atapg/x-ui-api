require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

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
