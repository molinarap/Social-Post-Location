var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photo = new Schema({
    id: {
        type: String,
        index: true,
        unique: true
    },
    caption: {
        created_time: String,
        from: {
            full_name: String,
            id: String,
            profile_picture: String,
            username: String,
        },
        id: String,
        text: String
    },
    created_time: String,
    filter: String,
    images: {
        low_resolution: {
            height: Number,
            url: String,
            width: Number
        },
        standard_resolution: {
            height: Number,
            url: String,
            width: Number
        },
        thumbnail: {
            height: Number,
            url: String,
            width: Number
        },
    },
    link: String,
    location: {
        id: Number,
        latitude: String,
        longitude: String,
        name: String
    },
    tags: [String],
    type: String,
    user: {
        full_name: String,
        id: String,
        profile_picture: String,
        username: String
    },
    comments: String,
    likes: String,
    geo: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

Photo.index({ geo: '2dsphere' });

module.exports = mongoose.model('Photo', Photo);
