const knex = require('../../connection/database');

module.exports = async (req, res) => {
	const { user } = req;
	const { id } = req.params;

	try {
		const [client] = await knex('clients').where({ id });

		if (!client) {
			return res.status(404).json('Cliente não encontrado.');
		}

		return res.json(client);
	} catch (error) {
		return res.status(500).json(error.message);
	}
}