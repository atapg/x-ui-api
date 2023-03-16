const axios = require('axios')
const { httpsAgent } = require('../config/config')
const qs = require('qs')
const {
	generatePort,
	generateUUID,
	convertToBase64,
	convertFromBase64,
} = require('../utils/helpers')
const { System } = require('../models/models')
const { Inbounds } = require('../models/models')
const { streamSettings, sniffing } = require('../utils/constants')
const { addVmessIntoMongoDb } = require('./mongo')

const createMainVmessInbound = async (
	hostName,
	remark,
	totalGB,
	expiryTimeInTimestamps,
) => {
	const totalInBytes = totalGB * 1024 * 1024 * 1024

	const host = await System.findOne({
		where: {
			hostName: hostName,
		},
	})

	if (!host) return 'Err'

	const data = {
		up: 0,
		down: 0,
		total: totalInBytes,
		remark: remark ? remark : 'turboo_server',
		enable: true,
		expiryTime: expiryTimeInTimestamps,
		listen: null,
		port: generatePort(),
		protocol: 'vmess',
		settings: {},
		streamSettings: {},
		sniffing: {},
	}

	const id = generateUUID()

	const settings = {
		clients: [
			{
				id: id,
				alterId: 0,
				email: '',
				limitIp: 0,
				totalGB: 0,
				expiryTime: 0,
			},
		],
		disableInsecureEncryption: false,
	}

	data.settings = JSON.stringify(settings)
	data.streamSettings = JSON.stringify(streamSettings)
	data.sniffing = JSON.stringify(sniffing)

	console.info(`Adding new inbound into: ${hostName}`)

	return axios({
		httpsAgent,
		method: 'POST',
		url: `${hostName}/xui/inbound/add`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: `session=${host.dataValues.session}`,
		},
		data: qs.stringify(data),
	})
		.then(async ({ data }) => {
			console.info(`Inbound successfully added into: ${hostName}`)

			const url = convertToBase64({
				v: '2',
				ps: data.obj.remark,
				add: host.dataValues.host,
				port: data.obj.port,
				id: id,
				aid: 0,
				net: 'tcp',
				type: 'http',
				host: 'bmi.ir',
				path: '/',
				tls: 'none',
			})

			// await Inbounds.create({
			// 	inboundId: data.obj.id,
			// 	total: data.obj.total,
			// 	remark: data.obj.remark,
			// 	port: data.obj.port,
			// 	protocol: data.obj.protocol,
			// 	SystemId: host.dataValues.id,
			// 	expiryTime: data.obj.expiryTime,
			// 	url: url,
			// })

			await addVmessIntoMongoDb(url, totalGB)

			return data.obj
		})
		.catch(err => {
			console.error(err)
			console.error(`Couldn't add inbound into: ${hostName}`)
			return err
		})
}

const getInboundsList = async ({ hostName = null, plainHostName = null }) => {
	const searchQuery = {}

	if (plainHostName) searchQuery.host = plainHostName
	else if (hostName) searchQuery.hostName = hostName

	const host = await System.findOne({
		where: searchQuery,
	})

	if (!host) {
		return []
	}

	return axios({
		httpsAgent,
		method: 'POST',
		url: `${host.dataValues.hostName}/xui/inbound/list`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: `session=${host.dataValues.session}`,
		},
	})
		.then(({ data }) => {
			console.log(`Get list of inbounds successfully`)

			return data.obj
		})
		.catch(err => {
			return []
		})
}

const deleteVmessInbound = async (url = null, inboundId = null) => {
	const obj = JSON.parse(convertFromBase64(url))

	let id = null
	if (!inboundId) {
		const list = await getInboundsList({ plainHostName: obj.add })

		const inbound = list.filter(listItem => {
			return listItem.port === obj.port
		})

		if (inbound.length <= 0) {
			return false
		}

		id = inbound[0].id
	} else {
		id = inboundId
	}

	const host = await System.findOne({
		where: {
			host: obj.add,
		},
	})

	if (!host) return 'Host not found'

	return axios({
		httpsAgent,
		method: 'POST',
		url: `${host.dataValues.hostName}/xui/inbound/del/${id}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: `session=${host.dataValues.session}`,
		},
	})
		.then(async ({ data }) => {
			console.log(
				`Inbound ${id} deleted successfully, host: ${host.dataValues.hostName}`,
			)

			await Inbounds.destroy({
				where: {
					inboundId: id,
				},
			})

			return data.success
		})
		.catch(err => {
			console.log(err)

			console.log(
				`Failed to delete inbound ${id}, host: ${host.dataValues.hostName}`,
			)

			return false
		})
}

const getVmessInboundTraffic = async url => {
	if (!url) return false

	const obj = JSON.parse(convertFromBase64(url))

	const list = await getInboundsList({ plainHostName: obj.add })

	if (list.length <= 0) return false

	const inbound = list.filter(listItem => {
		return listItem.port === parseInt(obj.port)
	})

	if (inbound.length <= 0) {
		return false
	}

	const clients = JSON.parse(inbound[0].settings).clients

	const findClient = clients.filter(client => {
		return client.id === obj.id
	})

	const email = findClient[0].email

	const clientStats = inbound[0].clientStats.filter(stats => {
		return stats.email === email
	})

	if (clients.length === 1) {
		return {
			down: inbound[0].down,
			up: inbound[0].up,
			total: inbound[0].total,
			expiryTime: inbound[0].expiryTime,
		}
	} else if (clientStats.length <= 0) {
		return {
			down: inbound[0].down,
			up: inbound[0].up,
			total: inbound[0].total,
			expiryTime: inbound[0].expiryTime,
		}
	} else {
		return {
			down: clientStats[0].down,
			up: clientStats[0].up,
			total: clientStats[0].total,
			expiryTime: clientStats[0].expiryTime,
		}
	}
	// const host = await System.findOne({
	// 	where: {
	// 		host: obj.add,
	// 	},
	// })

	// if (!host) return 'Host not found'
}

const getVlessInboundTraffic = async url => {
	if (!url) return false

	function validUUID(id) {
		const regex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

		return regex.test(id)
	}

	const id = url.split('@')[0]

	const addressWithPort = url.split('@')[1].split('?')
	const addUrl = addressWithPort[0]

	const host = addUrl.split(':')[0]
	let port = addUrl.split(':')[1]

	if (port.endsWith('/')) {
		port = port.slice(0, -1)
	}

	try {
		const list = await getInboundsList({ plainHostName: host })

		if (list.length <= 0) return false

		const inbound = list.filter(listItem => {
			return listItem.port === parseInt(port)
		})

		if (inbound.length <= 0) {
			return false
		}

		const clients = JSON.parse(inbound[0].settings).clients

		const client = clients.filter(client => client.id === id)

		const email = client[0].email

		const rest = inbound[0].clientStats.filter(stats => stats.email === email)

		if (rest.length <= 0) {
			return {
				down: inbound[0].down,
				up: inbound[0].up,
				total: inbound[0].total,
				expiryTime: inbound[0].expiryTime,
			}
		}

		return {
			down: rest[0].down,
			up: rest[0].up,
			total: rest[0].total,
			expiryTime: rest[0].expiryTime,
		}
	} catch (e) {
		console.log({ e })
		return false
	}
}

module.exports = {
	createMainVmessInbound,
	getInboundsList,
	deleteVmessInbound,
	getVmessInboundTraffic,
	getVlessInboundTraffic,
}
