var mongoose = require('mongoose');
var config = require('./config');

var db = mongoose.connection;

var openConn = function() {
    return new Promise(function(resolve, reject) {
        mongoose.connect(config.db);
        db.on('connected', function() {
            console.log('--- OPEN CONNECTION DB ---');
            resolve();
        });
        // If the connection throws an error
        db.on('error', function(err) {
            console.log('--- ERROR CONNECTION DB ---');
            reject();
        });
    });
}

var closeConn = function() {
    return new Promise(function(resolve, reject) {
        db.close(function() {
            console.log('--- CLOSE CONNECTION DB ---');
            //process.exit(0);
        });
    });
}


// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {
    db.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

exports.openConn = openConn;
exports.closeConn = closeConn;
