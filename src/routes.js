const axios = require('axios')
const { httpsAgent } = require('./config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models')
const { addClientIntoInbound } = require('./controllers/client')
const {
	createMainVmessInbound,
	deleteVmessInbound,
} = require('./controllers/inbound')

// ------------ { Inbound routes } ------------

route.get('/', async (req, res) => {})

// Create client
// route.post('/client', async (req, res) => {
// 	res.send(await addClientIntoInbound('https://xx.shapark-tab.com:6767'))
// })

route.post('/inbound', async (req, res) => {
	const { hostName, totalGB, expiryTime, remark } = req.body

	const inbound = await createMainVmessInbound(
		hostName,
		remark,
		totalGB,
		expiryTime,
	)

	if (!inbound) return res.status(400).send('Failed to create inbound')

	res.json(inbound)
})

route.delete('/inbound', async (req, res) => {
	const inbound = await deleteVmessInbound(req.body.url)

	if (inbound) return res.json({ message: inbound })

	return res.status(400).json({ message: false })
})

// ------------ { Inbound routes } ------------

// ------------ { System routes } ------------

route.post('/system', async (req, res) => {})

// ------------ { System routes } ------------

module.exports = route
