var jwt         = require('jsonwebtoken');
var config      = require('config'); 
var redisClient = require('./redisdb').redisClient;
var TOKEN_EXPIRATION = 60000;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

var getToken = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        
        if (part.length == 2) {
            var token = part[1];
            
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

exports.expireToken = function (headers) {
    var token = getToken(headers);
    
    if (token) {
        redisClient.set(token, { is_expired: true });
        redisClient.expire(token, TOKEN_EXPIRATION_SEC);
        
        redisClient.end();
    }
};

exports.verifyToken = function (req, res, next) {
    var token = getToken(req.headers);
    
    redisClient.get(token, function (err, reply) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        
        if (reply) {
            jwt.verify(token, config.secretToken, function (err, decoded) {
                if (err) {
                    console.log(err);
                    res.send(401);
                }
                
                if (decoded === reply.key) {
                    next();
                } else {
                    res.send(401);
                }  
            });                      
        } else {
            //TODO: need to refresh token.
            res.send(401);
        }
    });
    redisClient.end();
};

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;