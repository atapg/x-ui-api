const axios = require('axios')
const { httpsAgent } = require('../config')
const qs = require('qs')
const { System } = require('../models')

// Every session expires in 30days so create cron job and update each session
const updateOrCreateSessions = async () => {
	const hosts = await System.findAll({
		attributes: ['hostName', 'username', 'password'],
	})

	if (hosts.length <= 0) {
		console.log('No system found, Please add some!')
		return
	}

	console.info('Updating sessions started')
	for (let i = 0; i < hosts.length; i++) {
		const host = hosts[i].dataValues
		console.log(host)
		axios({
			httpsAgent,
			method: 'POST',
			url: `${host.hostName}/login`,
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			data: qs.stringify({
				username: host.username,
				password: host.password,
			}),
		})
			.then(async response => {
				if (!response.data.success) return 'Failed'

				const session = response.headers['set-cookie'][0]
					.split(';')[0]
					.substring(8)

				// Use this session to have an access to other apis
				const updateSystemSession = await System.update(
					{ session: session },
					{
						where: {
							hostName: host.hostName,
						},
					},
				)

				if (!updateSystemSession) {
					console.error(
						`Failed to update Host's session, HOST_NAME: ${host.hostName}`,
					)
				}

				console.info(`${host.hostName}'s session updated successfully`)
			})
			.catch(err => {
				console.error(err)
			})
	}
}

module.exports = { updateOrCreateSessions }
