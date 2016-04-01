var mongoose = require('mongoose');
var config = require('../config');
var options = {};

'use strict';

mongoose.connect(config.DB_CONNECTION, options, function (err, res) {
    if (err) {
        console.log('Connection refused to ' + config.DB_CONNECTION);
        console.log(err);
    }
    
    console.log('Connection successful to ' + config.DB_CONNECTION);
});

module.exports = {
    User: require('./user'),
    Strategy: require('./strategy')
};