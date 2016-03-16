var restify     = require('restify');
var jwt         = require('jsonwebtoken');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var fileRotator = require('file-stream-rotator');
var fs          = require('fs');
var config      = require('config'); 

var User = require('./models/user');
 
// connect to db
mongoose.connect(process.env.MONGO_URL || config.dbUri);

// initialize logger settings
fs.existsSync(config.logDir) || fs.mkdirSync(logDir)

var logStream = fileRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: config.logDir + '/api-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

var server = restify.createServer({
    name: 'soostep-restify'
});

server.use(restify.acceptParser(server.acceptParser));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('combined', {stream: logStream}));


var services = {};
services.users = require('./services/users');

server.all('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

server.post('/signin', routes.users.login);
server.get('/signout', jwt({secret: config.secretToken}), routes.user.logout);

var port = config.port || 3001;

server.listen(port, function () {
    console.log('%s is listening localhost:%', server.name, config.port);
});