const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const System = sequelize.define(
	'System',
	{
		host: DataTypes.STRING,
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
		inboundsCount: {
			type: DataTypes.BIGINT,
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

const Inbounds = sequelize.define(
	'Inbounds',
	{
		inboundId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		total: {
			type: DataTypes.BIGINT,
		},
		remark: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		port: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		protocol: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		expiryTime: DataTypes.BIGINT,
		url: DataTypes.TEXT,
	},
	{ timestamps: true },
)

const Clients = sequelize.define(
	'Clients',
	{
		inboundId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		total: {
			type: DataTypes.BIGINT,
		},
		email: {
			type: DataTypes.STRING,
		},
		hostName: DataTypes.STRING,
		expiryTime: DataTypes.STRING,
		clientId: DataTypes.STRING,
	},
	{ timestamps: true },
)

// Relationships
System.hasOne(Inbounds)
Inbounds.belongsTo(System)

sequelize
	.sync({ force: false })
	.then(() => {
		console.log('All tables created successfully')
	})
	.catch(() => {
		console.log("Couldn't sync tables")
	})

module.exports = { System, KeyValue, Inbounds, Clients }
