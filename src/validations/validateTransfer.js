const yup = require('./config');
const { string } = require('yup');
const isNumber = require('../utils/isNumber');

const schema = yup.object().shape({
  origin_account_number: isNumber().required(), 
  destiny_account_number: isNumber().required(), 
  value: isNumber().required(), 
  password: isNumber().required() 
});

module.exports = schema;