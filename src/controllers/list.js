const axios = require('axios')
const { System } = require('../models')
const { httpsAgent } = require('../config')

const getListOfInbounds = async hostName => {
	const host = await System.findOne({ where: { hostName } })

	if (!host) {
		return null
	}

	return axios({
		method: 'POST',
		httpsAgent,
		url: `${hostName}/xui/inbound/list`,
		headers: {
			Cookie: `session=${host.dataValues.session}`,
		},
	})
		.then(({ data }) => {
			return data.obj
		})
		.catch(err => {
			return err
		})
}

module.exports = { getListOfInbounds }
