var fs          = require('fs');
var moment      = require('moment');
var bunyan      = require('bunyan');
var fileRotator = require('file-stream-rotator');
var config      = require('../config'); 

// create log directory.
fs.existsSync(config.LOG_PATH) || fs.mkdirSync(config.LOG_PATH)

/**
 * initialize logger for incoming request.
 */
var syslog = fileRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: config.LOG_PATH + '/sys-%DATE%.log',
    frequency: 'daily',
    verbose: false
});


/**
 * initialize logger for business logic.
 */
var bizlog = bunyan.createLogger({
    name: 'soostep-restify log',
    streams: [{
        type: 'rotating-file',
        path: config.LOG_PATH + '/biz-' + moment().format('YYYYMMDD') +'.log',
        period: '1d',
        count: 7
    }]
});

module.exports = {
    syslog: syslog,
    bizlog: bizlog
}