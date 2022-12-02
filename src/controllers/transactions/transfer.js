const knex = require('../../connection/database');
const { format } = require('date-fns');
const validateTransfer= require('../../validations/validateTransfer');
const bcrypt = require('bcrypt');


module.exports = async (req, res) => {
	const { user } = req;
	const { id } = req.params;
	const { origin_account_number, destiny_account_number, value, password, status, tipe } = req.body;
			
	try {
		if (status === 'bloqueada') {
			return res.satus(401).json('Não foi possível realizar a operação, a conta está bloqueada.');
		}    
		
		if (!origin_account_number, !destiny_account_number, !value, !password, !tipe) {
			return res.satus(400).json('Todos os campos são obrigatórios');
		};    
			  
		if (tipe != 'transferência') {
			return res.satus(400).json('Selecione "Transferência".');
		}
		
		await validateTransfer.validate(req.body);
		
		const [originAccountFound] = await knex('clients').where({ id });
		
		if (!originAccountFound) {
			return res.status(404).json('Conta de origem não encontrada');
		};
		
		const correctPassword = await bcrypt.compare(password, originAccountFound.password);

		if (!correctPassword) {
			return res.status(400).json('A senha está incorreta!');
		}
			
		const [destinyAccountFound] = await knex('clients').where({ account_number: destiny_account_number });
		
		if (!destinyAccountFound) {
			return res.status(404).json('Conta destinada não encontrada');
		};
				
		if (value <= 0) {
			return res.status(400).json('O valor não pode ser menor ou igual a 0');
		}; 
				 
		const [originAccountBalance] = await knex('clients').where({ account_number: origin_account_number });
	
		if (originAccountBalance.balance < value) {
			return res.status(403).json({ mensagem: 'Saldo insuficiente' });
		}
		
		// To do: query que adiciona valor ao destino e subtrai da origem
		
		const dataForTransfer = await knex('transactions').inset({
			date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
			origin_account_number, 
			destiny_account_number, 
			value,  
			tipe,
			status 
		}).returning('*');
	
		if (!dataForTransfer) {
			return res.status(400).json('Não foi possível realizar operação')
		}
	
		return res.status(201).json('Operação realizada com sucesso');
	} catch (error) {
		return res.status(500).json(error.message)
	}	
}