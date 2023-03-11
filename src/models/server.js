const mongoose = require('mongoose')

const serverSchema = mongoose.Schema(
	{
		url: {
			type: String,
		},
		plan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'plan',
		},
		type: {
			type: String,
			enum: ['test', 'sell'],
			default: 'sell',
		},
		bandWidth: {
			type: Number,
			required: true,
		},
		size: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
		},
		expiresAt: {
			type: Date,
		},
		duration: {
			type: Number,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('server', serverSchema)
