const validateRegisterClient = require('../../validations/validateRegisterClient');
const knex = require('../../connection/database');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
	const { 
		name, 
		email, 
		password, 
		cpf,
        phone,
        cep,
        address,
        complement,
        neighborhood,
        city,
        state } = req.body;
	
	
	try {
		await validateRegisterClient.validate(req.body);

		const clientsList = await knex('clients').where({ email }).orWhere({ cpf });

        for (client of clientsList) {
            if (client.email === email) {
                return res.status(400).json("O email informado já está cadastrado!");
            }
            if (client.cpf === cpf) {
                return res.status(400).json("O CPF informado já está cadastrado!");
            }
        }

		if (password) {
			if (password.length < 8 || password.length > 8) {
				return res.status(400).json('A senha precisa ter 8 caracteres!');
			}
		}	
		
		const passwordEncrypted = await bcrypt.hash(password, 8);

		const { rowCount } = await knex('clients').insert({
			name: name.trim(),
			email,
			password: passwordEncrypted,
			cpf,
			phone,
			cep,
			address,
			complement,
			neighborhood,
			city,
			state
		});

		if (!rowCount) {
			return res.status(400).json('Não foi possível realizar o cadastro no momento.')
		}

		return res.status(201).json('Cadastro realizado com sucesso.');
	} catch(error){
		return res.status(500).json( error.message )
	}
}
