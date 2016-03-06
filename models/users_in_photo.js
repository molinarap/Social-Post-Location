var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersInPhoto = new Schema({
    position: {
        x: String,
        y: String,
    },
    user: {
        full_name: String,
        id: String,
        profile_picture: String,
        username: String
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('UsersInPhoto', UsersInPhoto);
