const yup = require('./config');
const { string } = require('yup');
const isNumber = require('../utils/isNumber');

const schema = yup.object().shape({
    sender: string().min(4).required(), 
    account_number: isNumber().required(), 
    client_name: string().required(), 
    status: string().required(),
    valor: string().required()
});

module.exports = schema;