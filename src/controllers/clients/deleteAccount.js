const knex = require('../connection/database');

module.exports = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  try {
    const [client] = await knex('client').where({ id });

    if (!client) {
      return res.status(404).json('Conta não encontrada!');
    }

    if (client.status === 'bloqueada') {
      return res.status(400).json('Não é possível excluir conta bloqueada.');
    }
    
    if (client.balance >= 0) {
      return res.status(400).json('Pra excluir a conta o seu saldo precisa ser zerado.');
    }

    const clientDeleted = await knex('client').where({ id }).del();

    if (!clientDeleted) {
      return res.status(400).json('Não foi possível excluir conta.');
    }

    return res.json('Conta excluída com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}