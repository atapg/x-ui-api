const Server = require('../models/server')
const Plan = require('../models/plan')
const User = require('../models/user')

const addVmessIntoMongoDb = async (
	url,
	traffic,
	description,
	owner = null,
	planId = null,
) => {
	try {
		let type
		let plan

		const data = {
			url: 'vmess://' + url,
			bandWidth: traffic,
		}

		if (traffic === 1) type = 'test'
		else {
			type = 'sell'

			plan = await Plan.findOne({
				bandWidth: traffic,
			})

			if (plan) data.plan = plan._id
		}

		if (description) data.description = description
		if (owner) data.owner = owner
		if (planId) data.plan = planId

		data.type = type
		data.size = 'GB'

		const sv = await Server.create(data)

		if (!sv) return null

		if (type === 'test') {
			await User.findByIdAndUpdate(owner, {
				testServer: sv._id,
			})
		}

		return sv
	} catch (e) {
		return null
	}
}

module.exports = { addVmessIntoMongoDb }
