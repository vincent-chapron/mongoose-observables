var Rx = require('rx');

let deleter = {};

module.exports = deleter;

deleter.removeAll = require('./remove_all');
deleter.removeOne = require('./remove_one');
