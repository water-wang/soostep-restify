/** 
 * require reference
*/
var restify = require('restify');
var morgan  = require('morgan');
var config  = require('./config'); 
var routes  = require('./routes');
var util    = require('./util');

/** 
 * variables
*/
var bizlog  = util.bizlog;
var syslog  = util.syslog;
var router  = util.router;
var session = util.sessionstore;

/** 
 * create server
*/
var server = restify.createServer({
    name: 'soostep-restify',
    log: bizlog
});

/**
 * server middleware 
 * */ 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS(config.CORS));
server.use(morgan('combined', {stream: syslog}));
server.use(session);
//server.use(router(routes)); //TODO: router problem need to be solved

server.get('/user', function (req, res) {
    console.log('hello world from process %s.', process.pid);
    bizlog.info('hello world to log.');
    res.end('hello world!');
});


/** 
 * process events watching
*/
process.on('message', function (message) {
    if (message.cmd == 'updateOfRequestTotal') {
        requests = message.requests;
        console.log('Total requests number is %s, worker %s is handling request.', requests, message.workerid);
    }
});   
    
process.on('uncaughtException', function (err) {
    console.log('got uncaught exception: ' + err.message);
    process.exit(1);
});

// process.on('SIGINT', function () {
//     console.log('got ctrl-c.');
//     server.close();
// });

process.on('exit', function (code) {
    console.log(code === 0 ? 'Exiting sucessful...' 
                        : 'Exiting unsucessful...');
});   

module.exports = server;