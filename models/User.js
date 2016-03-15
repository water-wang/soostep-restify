var mongoose     = require('mongoose');
var Schema       = mongoose.Scema;
 
var UserSchema   = new Schema({
    Name: String,
    Mobile: String,
    Token: String
});
 
module.exports = mongoose.model('User', UserSchema);