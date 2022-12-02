const yup = require('./config');
const { string } = require('yup');
const isNumber = require('../utils/isNumber');

const schema = yup.object().shape({
	name: string().required().min(4),
	email: string().email().required(),
	password: isNumber().required().max(8),
	cpf: isNumber().required().min(11).max(11),
	phone: string().required().min(10).max(11)
});

module.exports = schema;