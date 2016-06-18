var Rx = require('Rx');

let updater = {};

module.exports = updater;

updater.find_one = require('./update_one');
