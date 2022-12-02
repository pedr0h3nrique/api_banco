const knex = require('../../connection/database');
const { format } = require('date-fns');
const validateWithdraw = require('../..validations/validateWithdraw');
const bcrypt = require('bcrypt');


module.exports = async (req, res) => {
	const { user } = req;
	const { id } = req.params;
	const { account_number, value, password, status, tipe } = req.body
		
	try {
		if (status === 'bloqueada') {
			return res.satus(401).json('Não foi possível realizar a operação, a conta está bloqueada.');
	  }    

		if (!account_number, !value, !password) {
			return res.satus(400).json('Todos os campos são obrigatórios.');
		}
	
		if (tipe != 'saque') {
			return res.satus(400).json('Selecione "Saque".');
		}
		
		await validateWithdraw.validate(req.body);
		
		const [accountFound] = await knex('clients').where({ id });
		
		if (!accountFound) {
			return res.status(404).json('Conta não encontrada.');
		};

		const correctPassword = await bcrypt.compare(password, accountFound.password);

		if (!correctPassword) {
			return res.status(400).json('A senha está incorreta!');
		}
		
		if (value <= 0) {
			return res.status(400).json('O valor não pode ser menor ou igual a 0');
		};

		if (contaEncontrada.saldo < valor) {
			return res.status(403).json({ mensagem: 'Saldo insuficiente' });
		}

		if (accountFound.balance < value) {
			return res.status(403).json('Saldo insuficiente');
		}
	
		// To do: query que subtrai valor do saldo
		
		const dataForWithdraw = await knex('transactions').isert({
			data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
			account_number, 
			value,  
			tipe,
			status
		});
		
		if (!dataForWithdraw) {
			return res.status(400).json('Não foi possível concluir a operação.')
		}
		
		return res.status(201).json('Operação realizda com sucesso!');
	} catch (error) {
		return res.status(500).json(error.message);
	}
}