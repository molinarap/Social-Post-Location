var mongoose = require('mongoose');

var config = require('./config');

mongoose.connect(config.db);

mongoose.connection.on('error', function(err) {
    console.log('db', err);
    mongoose.disconnect();
});

/*mongoose.connection.close(function() {
    console.log('Mongoose disconnected on app termination');
});*/