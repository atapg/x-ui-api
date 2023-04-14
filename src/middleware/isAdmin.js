const User = require('../models/user')
const { decodeToken } = require('../utils/token')

module.exports = async (req, res, next) => {
	try {
		if (!req.headers['x-api-key']) {
			return res.status(401).send({
				status: 'failed',
				message: 'Unauthorized',
			})
		}

		if (req.headers['x-api-key'] !== process.env.BOT_TOKEN) {
			return res.status(401).send({
				status: 'failed',
				message: 'Unauthorized',
			})
		}

		next()
	} catch (e) {
		return res.status(401).send({
			status: 'failed',
			message: 'Unauthorized',
		})
	}
}
