const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./db')

const System = sequelize.define(
	'System',
	{
		hostName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		session: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
	},
)

const KeyValue = sequelize.define(
	'KeyValue',
	{
		key: DataTypes.STRING,
		value: DataTypes.TEXT,
	},
	{
		timestamps: true,
	},
)

sequelize
	.sync()
	.then(() => {
		console.log('All tables created successfully')
	})
	.catch(() => {
		console.log("Couldn't sync tables")
	})

module.exports = { System, KeyValue }
