const validateDeposit = require('../../validations/validateDeposit');
const knex = require('../../connection/database');
const { format } = require('date-fns');

module.exports = async (req, res) => {
    const { user } = req;
    const { sender, account_number, client_name, status, value, tipe } = req.body;
           
    try{
        if (status === 'bloqueada') {
              return res.satus(401).json('Não foi possível realizar a operação, a conta está bloqueada.');
        }     
            
        if (tipe != 'deposito') {
              return res.satus(400).json('Selecione "Depósito".');
        }     
    
        if (!sender || !account_number || !value || !client_name) {
              return res.satus(400).json('Por favor, informe todos os campos.');
        }
            
        await validateDeposit.validate(req.body);
    
        const [clientFound] = await knex('clients').where({ account_number });
        
        if (!clientFound) {
            return res.status(404).json('Conta não encontrada');
        }
            
        if (value <= 0) {
            return res.status(400).json('O valor não pode ser menor ou igual a 0');
        }
              
        const dataForDeposit = await knex('transactions').inset({
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            sender,
            account_number,
            client_name,
            value,
            tipe,
            status
        }).returning('*');
               
        if (!dataForDeposit) {
               return res.status(400).json('Não foi possível realizar operação')
        }

        return res.status(201).json('Operação realizada com sucesso!')
        
    }catch(error) {
        return res.status(500).json(error.message);
    }
}