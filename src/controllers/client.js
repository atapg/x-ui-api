const {
	generateUUID,
	generateEmail,
	generatePort,
} = require('../utils/helpers')
const { streamSettings, sniffing } = require('../utils/constants')
const axios = require('axios')
const { httpsAgent } = require('../config')
const qs = require('qs')
const { Inbounds, System } = require('../models')

const addClientIntoInbound = async (
	hostName,
	totalGB = 1,
	expiryTimeInTimestamps = 0,
) => {
	const host = await System.findOne({
		where: {
			hostName: hostName,
		},
	})

	const inbound = await host.getInbound()

	if (!host) return 'Err'
	if (!inbound) return 'Err'

	const clientInfo = {
		id: generateUUID(),
		alterId: 0,
		email: `${generateEmail(10)}@x-ui-english.dev`,
		limitIp: 0,
		totalGB: totalGB * 1024 * 1024 * 1024, // change to bytes
		expiryTime: new Date(expiryTimeInTimestamps).getTime(),
	}

	const data = {
		up: 0,
		down: 0,
		total: 0,
		remark: inbound.dataValues.remark,
		enable: true,
		expiryTime: 0,
		listen: null,
		port: inbound.dataValues.port,
		protocol: inbound.dataValues.protocol,
		settings: {},
		streamSettings: {},
		sniffing: {},
	}

	const settings = {
		// first client has unlimited bandwidth
		clients: [clientInfo],
		disableInsecureEncryption: false,
	}

	data.settings = JSON.stringify(settings)
	data.streamSettings = JSON.stringify(streamSettings)
	data.sniffing = JSON.stringify(sniffing)

	console.log(
		`Adding new client into: ${hostName}, inboundId: ${inbound.dataValues.inboundId}`,
	)

	return axios({
		httpsAgent,
		method: 'POST',
		url: `${hostName}/xui/inbound/update/${inbound.dataValues.inboundId}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: `session=${host.dataValues.session}`,
		},
		data: qs.stringify(data),
	})
		.then(async ({ data }) => {
			// console.log(data.obj)
			console.log(
				`New client added into: ${hostName}, inboundId: ${inbound.dataValues.inboundId}`,
			)

			return data.obj
		})
		.catch(err => {
			console.error(err)
			console.error(
				`Couldn't add client into: ${hostName}, inboundId:${inbound.dataValues.inboundId}`,
			)
			return err
		})
}

module.exports = { addClientIntoInbound }
