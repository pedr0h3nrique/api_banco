const express = require('express');

const authentication = require('./middlewares/auth');
const registerClient = require('./controllers/clients/registerClient');
const verifyEmail = require('./controllers/clients/verifyEmail');
const login = require('./controllers/clients/login');
const getClient = require('./controllers/clients/getClient');
const updateClient = require('./controllers/clients/updateClient');
const listClients = require('./controllers/clients/listClients');

const deposit = require('./controllers/transactions/deposit');
const getBalance = require('./controllers/transactions/getBalance');
const getExtracts = require('./controllers/transactions/getExtracts');
const getExtractFilter = require('./controllers/transactions/getExtractFilter');
const transfer = require('./controllers/transactions/transfer');
const witdraw = require('./controllers/transactions/withdraw');

const routes = express();

routes.post('/client', registerClient);
routes.post('/email', verifyEmail);
routes.post('/login', login);
routes.get('/client', listClients);
routes.put('/client/:id', updateClient);
routes.get('/client/:id', getClient);
routes.delete('/:id', deleteAccount);

routes.use(authentication);

routes.post('/transation/:id', deposit);
routes.get('/transation:id', getBalance);
routes.get('/extract/:id', getExtracts);
routes.get('/selectedextract/:id', getExtractFilter);
routes.put('/transaction/:id', transfer);
// To do: rota do saque.

module.exports = routes;
