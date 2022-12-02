const knex = require('../../connection/database');

module.exports = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { account_number, password } = req.body;

   try {
       if (!account_number || !password) {
           return res.satus(400).json('O número da conta e a senha são obrigatórios.');
       }
    
       const [clientFound] = await knex('clients').where({ id });
           
       if (!clientFound) {
           return res.status(404).json('Conta não encontrada.');
       }
    
       const correctPassword = await bcrypt.compare(password, clientFound.password);
    
       if (!correctPassword) {
           return res.status(400).json('Senha inválida.');
       }
    
       return res.json(clientFound.balance)    
   } catch (error) {
        return res.status(500).json(error.message);
   }

}