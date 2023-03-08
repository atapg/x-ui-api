const axios = require('axios')
const { httpsAgent } = require('./config')
const route = require('express').Router()
const qs = require('qs')

// Login Route
route.post('/login', (req, res) => {
	const { username, password } = req.body

	if (!username || !password)
		return res.status(400).json({ message: 'Insufficient Credentials' })

	axios({
		httpsAgent,
		method: 'POST',
		url: `${process.env.HOST}/`,
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify({ username, password }),
	})
		.then(response => {
			const session = response.headers['set-cookie'][0]
				.split(';')[0]
				.substring(8)

			// Use this session to have an access to other apis
			console.log(session)
		})
		.catch(err => {
			res.status(400).send(err)
		})
})

module.exports = route
