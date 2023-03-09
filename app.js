require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

// DataBase Connection
require('./src/db')
const { getListOfInbounds } = require('./src/controllers/list')
const { updateOrCreateSessions } = require('./src/controllers/session')
const { generatePort } = require('./src/utils/helpers')
const { createMainVmessInbound } = require('./src/controllers/inbound')

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
	// updateOrCreateSessions()
	// createMainVmessInbound('https://xx.shapark-tab.com:6767')
})

// TODO create cron job each 30day to update hosts sessions

// JSON
//
// {
// 	"v": "2", // DONT touch keep it 2
// 	"ps": "3002", //remark
// 	"add": "sv9.turboo-server.com",
// 	"port": 57560,
// 	"id": "3fd401d9-6447-45ca-f429-bed28c49142b",
// 	"aid": 0, // keepit zero
// 	"net": "tcp",
// 	"type": "http",
// 	"host": "bmi.ir",
// 	"path": "/",
// 	"tls": "none"
// }
