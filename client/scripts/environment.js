const dotenv = require('dotenv-safe');

const result = dotenv.load({allowEmptyValues: true, silent: true}).parsed;

module.exports = result;
