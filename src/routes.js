const axios = require('axios')
const { httpsAgent } = require('./config/config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models/models')
const User = require('./models/user')
const { addClientIntoInbound } = require('./controllers/client')
const {
	createMainVmessInbound,
	deleteVmessInbound,
	getVmessInboundTraffic,
	getInboundsList,
	getVlessInboundTraffic,
} = require('./controllers/inbound')
const { findHost } = require('./utils/helpers')
const { generateToken } = require('./utils/token')
const adminMiddleware = require('./middleware/isAdmin')
const { convertToBase64 } = require('./utils/helpers')

route.post('/authenticate', async (req, res) => {
	const { telegram_id, id } = req.body

	const userByTelId = await User.findOne({ telegram_id })

	if (!userByTelId) return res.status(401).json({ message: 'Unauthorized' })

	const userById = await User.findById(id)

	if (!userById) return res.status(401).json({ message: 'Unauthorized' })

	if (userByTelId._id.toString() !== userById._id.toString())
		return res.status(401).json({ message: 'Unauthorized' })

	if (userById.role !== 'admin')
		return res.status(401).json({ message: 'Unauthorized' })

	return res.json({ token: generateToken(id) })
})

route.post('/inbound', adminMiddleware, async (req, res) => {
	const { totalGB, expiryTime, remark, owner, plan } = req.body
	let host = req.body.hostName

	if (!remark) return res.status(400).send('Insufficient Credentials')

	if (!host) {
		host = findHost(totalGB.toString())
	}

	const inbound = await createMainVmessInbound(
		host,
		remark,
		totalGB,
		expiryTime,
		owner,
		plan,
	)

	if (!inbound) return res.status(400).send('Failed to create inbound')

	res.json(inbound)
})

route.delete('/inbound', adminMiddleware, async (req, res) => {
	if (!req.body.url && !req.body.inboundId)
		return res.status(400).send('Insufficient Credentials')

	const inbound = await deleteVmessInbound(req.body.url, req.body.inboundId)

	if (inbound) return res.json({ message: inbound })

	return res.status(400).json({ message: false })
})

route.post('/inbound/traffic', async (req, res) => {
	if (!req.body.url) return res.status(400).send('Insufficient Credentials')

	try {
		if (req.body.protocol === 'vmess') {
			const traffic = await getVmessInboundTraffic(req.body.url)
			console.log(traffic)
			if (!traffic) return res.status(400).json({ message: false })

			return res.json(traffic)
		} else if (req.body.protocol === 'vless') {
			const traffic = await getVlessInboundTraffic(req.body.url)

			if (!traffic) return res.status(400).json({ message: false })

			return res.json(traffic)
		}
	} catch (e) {
		return res.status(400).send('Insufficient Credentials')
	}
})

route.get('/list', adminMiddleware, async (req, res) => {
	try {
		const { hostName } = req.query

		const list = await getInboundsList({ hostName })

		res.json(list)
	} catch (e) {
		return res.status(400).send('Bad Request')
	}
})

// ------------ { Inbound routes } ------------

// ------------ { System routes } ------------

// route.post('/system', async (req, res) => {
// 	const { host, hostName, username, password, description } = req.body
//
// 	if (!host || !hostName || !username || !password)
// 		return res.status(400).json({ message: 'Insufficient Credentials' })
//
// 	try {
// 		await System.create({ host, hostName, username, password, description })
//
// 		res.json({ message: true })
// 	} catch (e) {
// 		console.log('ERROR')
// 		res.status(400).json({ message: false })
// 	}
// })

// ------------ { System routes } ------------

module.exports = route
