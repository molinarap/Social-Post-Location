var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsPhoto = new Schema({
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

module.exports = mongoose.model('commentsPhoto', commentsPhoto);
