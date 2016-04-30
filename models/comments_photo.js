var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsPhoto = new Schema({
    id_photo: String,
    id: String,
    text: String,
    created_time: String,
    from: {
        full_name: String,
        id: String,
        profile_picture: String,
        username: String
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommentsPhoto', CommentsPhoto);