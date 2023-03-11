const { v4: uuidv4 } = require('uuid')

const generateUUID = () => {
	return uuidv4()
}

const generatePort = () => {
	return Math.floor(Math.random() * 65000) + 1000
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

module.exports = {
	generateUUID,
	generatePort,
	generateEmail,
	convertToBase64,
	convertFromBase64,
}
