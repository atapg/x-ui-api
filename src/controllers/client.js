const {
	generateUUID,
	generateEmail,
	generatePort,
} = require('../utils/helpers')
const { streamSettings, sniffing } = require('../utils/constants')
const axios = require('axios')
const { httpsAgent } = require('../config')
const qs = require('qs')
const { Inbounds, System, Clients } = require('../models')
const { getInboundsList } = require('./inbound')

const addClientIntoInbound = async (
	hostName,
	totalGB = 1,
	expiryTimeInTimestamps = 0,
) => {
	const totalInBytes = totalGB * 1024 * 1024 * 1024

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
		totalGB: totalInBytes, // change to bytes
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
		clients: [
			{
				id: 1,
				inboundId: 1,
				enable: true,
				email: '',
				up: 0,
				down: 0,
				expiryTime: 0,
				total: 0,
			},
			{
				id: 2,
				inboundId: 1,
				enable: true,
				email: 'zCCVGJvqMF@x-ui-english.dev',
				up: 0,
				down: 0,
				expiryTime: 0,
				total: 1073741824,
			},
			{
				id: 3,
				inboundId: 1,
				enable: true,
				email: 'nDUtdvKkh4@x-ui-english.dev',
				up: 0,
				down: 0,
				expiryTime: 0,
				total: 1073741824,
			},
			{
				id: 4,
				inboundId: 1,
				enable: true,
				email: 'F1gbRKTlCi@x-ui-english.dev',
				up: 0,
				down: 110,
				expiryTime: 0,
				total: 1073741824,
			},
			clientInfo,
		],
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

			await Clients.create({
				inboundId: inbound.dataValues.inboundId,
				total: totalInBytes,
				email: clientInfo.email,
				expiryTime: expiryTimeInTimestamps,
				clientId: clientInfo.id,
				hostName: hostName,
			})

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

const deleteClient = async clientId => {
	if (!clientId) return null

	const client = await Clients.findOne({
		where: { clientId },
	})

	if (!client) return null

	const host = await System.findOne({
		where: { hostName: client.dataValues.hostName },
	})

	if (!host) return null

	const list = await getInboundsList(client.dataValues.hostName)

	console.log(list)
}

// deleteClient('481a4fc1-d0cf-4e37-a34a-d7d1612ffcd6')

module.exports = { addClientIntoInbound, deleteClient }
