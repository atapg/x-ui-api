const User = require('../models/user')

module.exports = async (req, res, next) => {
	const user = await User.findOne({
		telegram_id: parseInt(req.headers.telegram_id),
	})

	if (!user) return res.status(401).json({ message: 'Unauthorized' })

	if (user.role !== 'admin')
		return res.status(401).json({ message: 'Unauthorized' })

	return next()
}
