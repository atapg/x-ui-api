const axios = require('axios')
const { httpsAgent } = require('./config/config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models/models')
const { addClientIntoInbound } = require('./controllers/client')
const {
	createMainVmessInbound,
	deleteVmessInbound,
	getVmessInboundTraffic,
	getInboundsList,
} = require('./controllers/inbound')
const { findHost } = require('./utils/helpers')

// route.use(require('./middleware/isAdmin'))

// ------------ { Inbound routes } ------------

route.get('/inbound', async (req, res) => {
	res.send(await getInboundsList(req.params))
})

// Create client
// route.post('/client', async (req, res) => {
// 	res.send(await addClientIntoInbound('https://xx.shapark-tab.com:6767'))
// })

route.post('/inbound', async (req, res) => {
	const { totalGB, expiryTime, remark } = req.body
	let host = req.body.hostName

	if (!totalGB || !remark)
		return res.status(400).send('Insufficient Credentials')

	if (!host) {
		host = findHost(totalGB.toString())
	}

	const inbound = await createMainVmessInbound(
		host,
		remark,
		totalGB,
		expiryTime,
	)

	if (!inbound) return res.status(400).send('Failed to create inbound')

	res.json(inbound)
})

route.delete('/inbound', async (req, res) => {
	if (!req.body.url) return res.status(400).send('Insufficient Credentials')

	const inbound = await deleteVmessInbound(req.body.url, req.body.inboundId)

	if (inbound) return res.json({ message: inbound })

	return res.status(400).json({ message: false })
})

route.post('/inbound/traffic', async (req, res) => {
	if (!req.body.url) return res.status(400).send('Insufficient Credentials')

	const traffic = await getVmessInboundTraffic(req.body.url)

	if (!traffic) res.status(400).json({ message: false })

	res.json(traffic)
})

// ------------ { Inbound routes } ------------

// ------------ { System routes } ------------

route.post('/system', async (req, res) => {
	const { host, hostName, username, password, description } = req.body

	if (!host || !hostName || !username || !password)
		return res.status(400).json({ message: 'Insufficient Credentials' })

	try {
		await System.create({ host, hostName, username, password, description })

		res.json({ message: true })
	} catch (e) {
		console.log('ERROR')
		res.status(400).json({ message: false })
	}
})

// ------------ { System routes } ------------

module.exports = route
