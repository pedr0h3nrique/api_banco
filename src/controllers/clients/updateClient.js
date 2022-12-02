const validateUpdate = require('../../validations/validateUpdateUser');
const knex = require('../../connection/database');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
	const { 
		nome, 
		email, 
		senha, 
		cpf, 
		telefone, 
		cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado } = req.body;
	const { id } = req.user;

	try {
		const dataForUpdate = await validateUpdate.validate(req.body);

		const [emailAlreadyUsed] = await knex('clients').where({ email });

		if (emailAlreadyUsed) {
			if (emailAlreadyUsed.id !== id) {
				return res.status(400).json('O email informado já está em uso.');
			}
		}

		if (senha) {
			if (senha.length < 8 || senha.length > 8) {
				return res.status(400).json('A senha precisa ter 8 caracteres!');
			}

			const encryptedPassword = await bcrypt.hash(senha, 8);
			dataForUpdate.senha = encryptedPassword;
		}

		if (cpf) {
			if (cpf.trim().length !== 11 || cpf != Number(cpf)) {
				return res.status(400).json('O CPF precisa ter 11 caracteres e apenas números!');
			}
			dataForUpdate.cpf;
		}

		if (telefone) {
			if (telefone.trim().length > 11 || telefone.trim().length < 10 || telefone != Number(telefone)) {
				return res.status(400).json('O telefone precisa ter entre 10 e 11 caracteres e apenas números!');
			}
			dataForUpdate.telefone;
		}

		dataForUpdate = [nome, 
			email, 
			senha, 
			cpf, 
			telefone, 
			cep,
			logradouro,
			complemento,
			bairro,
			cidade,
			estado]

		const [clientUpdated] = await knex('clients')
			.where({ id })
			.update(dataForUpdate)
			.returning('*');

		if (!clientUpdated) {
			return res.status(400).json('Não foi possível realizar atualização');
		}

		return res.json('Usuário atualizado com sucesso!');
	} catch (error) {
		return res.status(500).json(error.message);
	}
}