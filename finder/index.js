var Rx = require('Rx');

let finder = {};

module.exports = finder;

finder.find = require('./find');
finder.findOne = require('./find_one');
finder.findPage = require('./find_page');
