const mongoose = require('mongoose')

const planSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		bandWidth: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		size: {
			type: String,
			required: true,
		},
		order: {
			type: Number,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('plan', planSchema)
