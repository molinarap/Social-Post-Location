var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bear = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Bear', Bear);
