const streamSettings = {
	network: 'tcp',
	security: 'none',
	tcpSettings: {
		acceptProxyProtocol: false,
		header: {
			type: 'http',
			request: {
				method: 'GET',
				path: ['/'],
				headers: {
					Host: ['bmi.ir'],
				},
			},
			response: {
				version: '1.1',
				status: '200',
				reason: 'OK',
				headers: {},
			},
		},
	},
}

const sniffing = {
	enabled: true,
	destOverride: ['http', 'tls'],
}

module.exports = { sniffing, streamSettings }
