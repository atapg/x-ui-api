const { v4: uuidv4 } = require('uuid')

const generateUUID = () => {
	return uuidv4()
}

const generatePort = () => {
	return Math.floor(Math.random() * 90000) + 10000
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

module.exports = { generateUUID, generatePort, generateEmail }
