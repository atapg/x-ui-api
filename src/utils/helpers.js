const { v4: uuidv4 } = require('uuid')

const generateUUID = () => {
	return uuidv4()
}

const generatePort = () => {
	return Math.floor(Math.random() * 60000) + 1000
}

const generateEmail = length => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	let counter = 0
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
		counter += 1
	}

	return result
}

const convertToBase64 = txt => {
	return btoa(JSON.stringify(txt))
}

const convertFromBase64 = base64Txt => {
	return atob(base64Txt)
}

// TODO Don't forget to change
const findHost = traffic => {
	switch (traffic) {
		case '200':
			return 'https://frr.shapark-tab.com:6767'
		case '100':
			return 'https://sv6.turboo-server.com:3469'
		case '50':
			return 'https://sv6.turboo-server.com:3469'
		case '30':
			return 'https://frr.shapark-tab.com:6767'
		case '20':
			return 'https://sv9.turboo-server.com:6767'
		case '10':
			return 'https://ir2.shapark-tab.com:9595'
		case '1':
			return 'https://sv9.turboo-server.com:6767'
		default:
			return 'https://sv9.turboo-server.com:6767'
	}
}

const convertSubDomains = (domain = () => {
	switch (domain) {
		case '200':
			return 'https://frr.shapark-tab.com:6767'
		case '100':
			return 'https://sv6.turboo-server.com:3469'
		case '50':
			return 'https://sv6.turboo-server.com:3469'
		case '30':
			return 'https://frr.shapark-tab.com:6767'
		case '20':
			return 'https://sv9.turboo-server.com:6767'
		case '10':
			return 'https://ir2.shapark-tab.com:9595'
		case '1':
			return 'https://sv9.turboo-server.com:6767'
		default:
			return 'https://sv9.turboo-server.com:6767'
	}
})

module.exports = {
	generateUUID,
	generatePort,
	generateEmail,
	convertToBase64,
	convertFromBase64,
	findHost,
}
