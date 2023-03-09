const axios = require('axios')
const { httpsAgent } = require('./config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models')
const { addClientIntoInbound } = require('./controllers/client')

// ------------ { Inbound routes } ------------

route.get('/', async (req, res) => {})

// Create client
route.post('/client', async (req, res) => {
	await addClientIntoInbound('https://xx.shapark-tab.com:6767')
	res.send('End')
})

route.delete('/{id}', async (req, res) => {})

// ------------ { Inbound routes } ------------

// ------------ { System routes } ------------

route.post('/system', async (req, res) => {})

// ------------ { System routes } ------------

module.exports = route
