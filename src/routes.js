const axios = require('axios')
const { httpsAgent } = require('./config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models')
const { addClientIntoInbound } = require('./controllers/client')
const { createMainVmessInbound } = require('./controllers/inbound')

// ------------ { Inbound routes } ------------

route.get('/', async (req, res) => {})

// Create client
// route.post('/client', async (req, res) => {
// 	res.send(await addClientIntoInbound('https://xx.shapark-tab.com:6767'))
// })

route.post('/inbound', async (req, res) => {
	const { hostName, totalGB, expiryTime, remark } = req.body
	console.log('Here')
	res.send(await createMainVmessInbound(hostName, remark, totalGB, expiryTime))
})

route.delete('/{id}', async (req, res) => {})

// ------------ { Inbound routes } ------------

// ------------ { System routes } ------------

route.post('/system', async (req, res) => {})

// ------------ { System routes } ------------

module.exports = route
