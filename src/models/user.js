const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		telegram_id: {
			type: Number,
			required: true,
		},
		username: {
			type: String,
		},
		balance: {
			type: Number,
			default: 0,
		},
		invitedUsers: {
			type: Array,
		},
		chatId: {
			type: Number,
			required: true,
		},
		testServer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'server',
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('user', userSchema)
