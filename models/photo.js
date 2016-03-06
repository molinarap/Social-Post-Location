var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentsPhoto = require('../models/comments_photo');
var LikesPhoto = require('../models/likes_photo');
var UsersInPhoto = require('../models/users_in_photo');

var Photo = new Schema({
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
    comments: {
        count: Number,
        data: Array[CommentsPhoto],
    },
    created_time: String,
    filter: String,
    id: {
        type: String,
        index: true
    },
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
    likes: {
        count: Number,
        data: Array[LikesPhoto]
    },
    link: String,
    location: {
        id: Number,
        latitude: String,
        longitude: String,
        name: String
    },
    tags: Array[String],
    type: String,
    user: {
        full_name: String,
        id: String,
        profile_picture: String,
        username: String
    },
    users_in_photo: Array[UsersInPhoto],
    geo: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Photo', Photo);
