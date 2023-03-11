const Sequelize = require('sequelize')
const { updateOrCreateSessions } = require('../controllers/session')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite',
})

module.exports = sequelize
