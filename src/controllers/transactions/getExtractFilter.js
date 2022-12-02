const knex = require('../connection/database');

module.exports = async (req, res) => {
	const { user } = req;
	const { date } = req.body;
	try {
		const extractByDate = await knex('extracts').where(date);
		
		return res.status(200).json({ extractByDate });
	} catch (error) {
		return res.status(500).json(error.message);
	}
}