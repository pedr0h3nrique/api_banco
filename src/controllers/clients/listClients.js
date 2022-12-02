const knex = require('../../connection/database');

module.exports = async (req, res) => {
	const { user } = req;

	try {
		const clientsId = await knex('clients').orderBy('id', 'desc');
		const clientsAsc = await knex('clients').orderBy('nome', 'asc');
		const clientsDesc = await knex('clients').orderBy('nome', 'desc');

		return res.status(200).json({ clientsId, clientsAsc, clientsDesc });
	} catch (error) {
		return res.status(500).json(error.message);
	}
}