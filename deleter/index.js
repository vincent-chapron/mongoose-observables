var Rx = require('Rx');

let deleter = {};

module.exports = deleter;

deleter.removeAll = require('./remove_all');
deleter.removeOne = require('./remove_one');
