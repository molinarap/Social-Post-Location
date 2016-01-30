var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    instagramId: {
        type: String,
        index: true
    },
    username: String,
    fullName: String,
    picture: String,
    accessToken: String
});

module.exports = mongoose.model('User', UserSchema);
