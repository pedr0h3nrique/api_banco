const yup = require('./config');
const { string } = require('yup');
const isNumber = require('../utils/isNumber');

const schema = yup.object().shape({
    account_number: isNumber().required(), 
    tipe: string().required(),
    status: string().required(),
    value: isNumber().string().required(),
    password: isNumber().required().min(8)
});

module.exports = schema;
