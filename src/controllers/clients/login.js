const knex = require('../../connection/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateLogin = require('../../validations/validateLogin');

module.exports = async (req, res) => {
	const { email, password } = req.body;

	try {
		await validateLogin.validate(req.body);
		const [loggedClient] = await knex('client').where({ email });

		if (!loggedClient) {
			return res.status(400).json('O email não foi encontrado!');
		}

		const correctPassword = await bcrypt.compare(password, loggedClient.password);

		if (!correctPassword) {
			return res.status(400).json('A senha está incorreta!');
		}

		const token = jwt.sign({ id: loggedClient.id }, process.env.JWT_SECRET, {
			expiresIn: '2h'
		});

		const { password: _, ...loggedClientData } = loggedClient;

		return res.status(200).json({ client: loggedClientData, token });
	} catch (error) {
		return res.status(500).json(error.message);
	}
}