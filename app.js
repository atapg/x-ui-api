require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { updateOrCreateSessions } = require('./src/controllers/session')
const cron = require('node-cron')

// DataBase Connection
const sequelize = require('./src/config/db')

sequelize
	.authenticate()
	.then(() => {
		console.log('Database connected')
		updateOrCreateSessions()
	})
	.catch(() => {
		console.log('Database Connection Failed')
	})

require('./src/config/mongodb')

// Express app
const app = express()

// Middlewares and configs
app.use(bodyParser.json())

// Routes
app.use('/', require('./src/routes'))

// App running
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	console.log(`Server running on port: ${PORT}`)
})

// TODO create cron job each 30day to update hosts sessions
cron.schedule('59 30 5 * * *', () => {
	console.log(`Started To Update Sessions - ${new Date().toLocaleString()}`)

	updateOrCreateSessions()
})
