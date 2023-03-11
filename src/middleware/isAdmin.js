const User = require('../models/user')
const { decodeToken } = require('../utils/token')

module.exports = async (req, res, next) => {
	try {
		//TODO add auth
		if (!req.headers.authorization) {
			return res.status(401).send({
				status: 'failed',
				message: 'Unauthorized',
			})
		}

		const authorizationHeaderParse = req.headers.authorization.split(' ')

		if (authorizationHeaderParse.length < 2) {
			return res.status(401).send({
				status: 'failed',
				message: 'Unauthorized',
			})
		}

		const token = authorizationHeaderParse[1]
		const userId = decodeToken(token)

		const user = await User.findOne({ _id: userId })

		if (!user) {
			return res.status(400).send({
				message: 'Something went wrong!',
			})
		}

		if (user.role !== 'admin') {
			return res.status(401).send({
				status: 'failed',
				message: 'Unauthorized',
			})
		}

		req.authenticatedUser = user

		next()
	} catch (e) {
		return res.status(401).send({
			status: 'failed',
			message: 'Unauthorized',
		})
	}
}
