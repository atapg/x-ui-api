const https = require('https')

const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
	requestCert: true,
})

module.exports = { httpsAgent }
