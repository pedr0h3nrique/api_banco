const knex = require('../../connection/database');

module.exports = async (req, res) => {
	const { email } = req.body;

	try {
		const [emailAlredyExists] = await knex('clients').where({ email });

		if (emailAlredyExists) {
			return res.status(400).json('O email informado já está em uso!');
		}

		return res.json('Ok');
	} catch (error) {
		return res.status(500).json(error.message);
	}
};
