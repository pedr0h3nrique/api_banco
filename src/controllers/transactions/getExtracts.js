const knex = require('../../connection/database');
const { format } = require('date-fns');

module.exports = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  try {
		const clientExtract = await knex('extracts').where({ client_id: id });

		if (!clientExtract) {
			return res.status(404).json('Cliente não encontrado.');
		}

		return res.status(200).json(clientExtract);
	} catch (error) {
		return res.status(500).json(error.message);
	}
}