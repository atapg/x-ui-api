const Sequelize = require('sequelize')
const { updateOrCreateSessions } = require('../controllers/session')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite',
})

sequelize
	.authenticate()
	.then(() => {
		console.log('Database connected')

		updateOrCreateSessions()
	})
	.catch(() => {
		console.log('Database Connection Failed')
	})

module.exports = sequelize
