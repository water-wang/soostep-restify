var services = require('./services');
var user = services.user;

module.exports = {
    
    GET: {
        '/users': user.list,
        '/user/signout': user.signout
    },
    
    POST: {
        '/user/signin': user.signin,
        '/user/register': user.register
    },
    
    PUT: {
        
    },
    
    DELETE: {
        
    }
};

