const del = require('del');
const { params: { out } } = require('./config');

module.exports = () => () => del(out);
