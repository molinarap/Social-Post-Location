var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likesPhoto = new Schema({

    id: String,
    full_name: String,
    profile_picture: String,
    username: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('likesPhoto', likesPhoto);
