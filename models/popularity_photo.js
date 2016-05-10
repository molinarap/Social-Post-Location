var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PopularityPhoto = new Schema({

    id: String,
    popularity: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('PopularityPhoto', PopularityPhoto);
