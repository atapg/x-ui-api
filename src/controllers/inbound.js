const axios = require('axios')
const { httpsAgent } = require('../config')
const qs = require('qs')
const { generatePort, generateUUID } = require('../utils/helpers')
const { System } = require('../models')
const { Inbounds } = require('../models')
const { streamSettings, sniffing } = require('../utils/constants')

const createMainVmessInbound = async hostName => {
	const host = await System.findOne({
		where: {
			hostName: hostName,
		},
	})

	if (!host) return 'Err'

	const data = {
		up: 0,
		down: 0,
		total: 0,
		remark: 'turboo_server',
		enable: true,
		expiryTime: 0,
		listen: null,
		port: generatePort(),
		protocol: 'vmess',
		settings: {},
		streamSettings: {},
		sniffing: {},
	}

	const settings = {
		// first client has unlimited bandwidth
		clients: [
			{
				id: generateUUID(),
				alterId: 0,
				email: '',
				limitIp: '',
				totalGB: 0,
				expiryTime: '',
			},
		],
		disableInsecureEncryption: false,
	}

	data.settings = JSON.stringify(settings)
	data.streamSettings = JSON.stringify(streamSettings)
	data.sniffing = JSON.stringify(sniffing)

	console.log(`Adding new inbound into: ${hostName}`)

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
			console.log(`Inbound successfully added into: ${hostName}`)

			await Inbounds.create({
				inboundId: data.obj.id,
				total: data.obj.total,
				remark: data.obj.remark,
				port: data.obj.port,
				protocol: data.obj.protocol,
				SystemId: host.dataValues.id,
			})

			return data.obj
		})
		.catch(err => {
			console.error(err)
			console.error(`Couldn't add inbound into: ${hostName}`)
			return err
		})
}

const getInboundsList = async hostName => {
	const host = await System.findOne({
		where: {
			hostName: hostName,
		},
	})

	if (!host) return 'Err'

	return axios({
		httpsAgent,
		method: 'POST',
		url: `${hostName}/xui/inbound/list`,
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

module.exports = { createMainVmessInbound, getInboundsList }
