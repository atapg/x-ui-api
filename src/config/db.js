const Sequelize = require('sequelize')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite',
})

sequelize
	.authenticate()
	.then(() => {
		console.log('Database connected')
	})
	.catch(() => {
		console.log('Database Connection Failed')
	})

module.exports = sequelize
