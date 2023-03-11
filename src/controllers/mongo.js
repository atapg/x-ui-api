const Server = require('../models/server')
const Plan = require('../models/plan')

const addVmessIntoMongoDb = async (url, traffic, description) => {
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

		data.type = type
		data.size = 'GB'

		const sv = await Server.create(data)

		if (!sv) return null

		return sv
	} catch (e) {
		return null
	}
}

module.exports = { addVmessIntoMongoDb }
