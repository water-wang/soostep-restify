var jwt = require('jsonwebtoken');
var db = require('./models/user');
var config = require('./config');
var tokenManager = require('./middleware/token');
var redisClient = require('./redisdb').redisClient;

exports.signin = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    
    if (username == '' || password == '') {
        return res.send(401);
    }
    
    db.userModel.findOne({username: username}, function (err, user) {
        if(err) {
            console.log(err);
            return res.send(401);
        }
        
        if(user == undefined) {
            return res.send(401);
        }
        
        user.comparePassword(password, function (isMatch) {
            if (!isMatch) {
                console.log('Attempt failed to login with' + user.username);
                return res.send(401);
            }            
            var token = jwt.sign({id: user._id}, config.secretToken, { expiresIn : tokenManager.TOKEN_EXPIRATION_SEC });
            
            // store keypair<token, userid> in redis.
            redisClient.set(token, { key: user._id });
            redisClient.expire(token, TOKEN_EXPIRATION_SEC);
            redisClient.end();
        
            return res.json({token: token});
        });
    });
};

exports.signout = function (req, res) {
    if (req.user) {
        tokenManager.expireToken(req.headers);
        
        delete req.user;        
        return res.send(200);
    } else {
        return res.send(401);
    }
}

exports.register = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';
    
    if  (username == '' || password == '' || password != passwordConfirmation) {
        return res.send(400);
    }
    
    var user = new db.userModel();
    user.username = username;
    user.password = password;
    
    //TODO: need more validation before save.
    user.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }        
        res.send(200);
    })
}