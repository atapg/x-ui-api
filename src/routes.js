const axios = require('axios')
const { httpsAgent } = require('./config')
const route = require('express').Router()
const qs = require('qs')
const { System } = require('./models')

// Login Route
route.post('/login', async (req, res) => {})

module.exports = route
