var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FilterCount = new Schema({
    name: String,
    photo_id: [String],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FilterCount', FilterCount);

