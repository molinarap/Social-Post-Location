var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    instagramId: {
        type: String,
        index: true
    },
    username: String,
    fullName: String,
    name: String,
    surname: String,
    picture: String,
    accessToken: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);
