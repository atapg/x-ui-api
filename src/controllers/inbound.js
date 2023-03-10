const axios = require('axios')
const { httpsAgent } = require('../config')
const qs = require('qs')
const {
	generatePort,
	generateUUID,
	convertToBase64,
	convertFromBase64,
} = require('../utils/helpers')
const { System } = require('../models')
const { Inbounds } = require('../models')
const { streamSettings, sniffing } = require('../utils/constants')

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

			await Inbounds.create({
				inboundId: data.obj.id,
				total: data.obj.total,
				remark: data.obj.remark,
				port: data.obj.port,
				protocol: data.obj.protocol,
				SystemId: host.dataValues.id,
				expiryTime: data.obj.expiryTime,
				url: convertToBase64({
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
				}),
			})

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

	if (!host) return 'Err'

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
			console.log(`Get list of inbounds successfully, host: ${hostName}`)

			return data.obj
		})
		.catch(err => {
			console.error(err)
			return null
		})
}

const deleteVmessInbound = async url => {
	const obj = JSON.parse(convertFromBase64(url))
	console.log(obj)
	const list = await getInboundsList({ plainHostName: obj.add })

	const inbound = list.filter(listItem => {
		return listItem.port === obj.port
	})

	if (inbound.length <= 0) {
		return false
	}

	const id = inbound[0].id

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

module.exports = { createMainVmessInbound, getInboundsList, deleteVmessInbound }
