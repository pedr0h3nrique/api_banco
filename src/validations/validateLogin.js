const yup = require('./config');
const { string } = require('yup');
const isNumber = require('../utils/isNumber');


const schema = yup.object().shape({
	email: string().email().required(),
	password: isNumber().required().min(8)
});

module.exports = schema;