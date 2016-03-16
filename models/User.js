//var config       = require('./config');
var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// mongoose.connect(config.dbUri, {}, function (err, res) {
//     if (err) {
//         console.log('Connection refused to ' + config.dbUri);
//         console.log(err);
//     } else {
//         console.log('Connection successful to ' + config.dbUri);
//     }
// });

var Schema = mongoose.Schema;
 
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now }
});

User.pre('save', function (next) {
    var user = this;
    
    if (!user.isModified('password')) {
        return next();
    }
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        
        bcrypt.hash(user.password, salt, function (err, hash) {
            if(err) return next(err);
            user.password = hash;
            
            next();
        });
    });
});

User.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        
        cb(isMatch);
    });
};
 
var userModel = mongoose.model('User', User);

module.exports = userModel;