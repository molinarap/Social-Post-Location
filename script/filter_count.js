var request = require('request');
var FilterCount = require('../models/filter_count');
var Photo = require('../models/photo');

var config = require('../config');

var db = require('./../db');

var filters_info = [];

var count;

var start1, end2, start2, end2;

var contains = function(objId, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === objId) {
            return true;
        }
    }
    return false;
};

var countPhotos = function(argument) {
    return new Promise(function(resolve, reject) {
        Photo.count({}, function(err, c) {
            if (err) {
                reject(err);
            } else {
                resolve(c);
            }
        });
    });
};

var getPhotos = function() {
    return new Promise(function(resolve, reject) {
        console.log("getPhotos " + count);
        var query = Photo.find({}).skip(count).limit(1);
        query.exec(function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var getFilter = function(photo) {
    return new Promise(function(resolve, reject) {
        console.log("getFilter " + count);

        var filter = photo.filter;
        FilterCount.findOne({
            name: filter
        }, function(err, existingFilter) {
            if (err) {
                reject(err);
            } else {
                if (!existingFilter) {
                    console.log('NOT existingFilter');
                    var filterSave = new FilterCount({
                        name: filter,
                        photo_id: []
                    });
                    filterSave.photo_id.push(photo.id);
                    filterSave.save(function(result) {
                        console.log('Nuovo filter aggiunto');
                        resolve(true);
                    });
                } else {
                    console.log('existingFilter');
                    if (!contains(photo.id, existingFilter.photo_id)) {
                        console.log('existingFilter -----------------> ' + photo.id);
                        existingFilter.photo_id.push(photo.id);
                        FilterCount.update({ name: filter }, { $set: { 'photo_id': existingFilter.photo_id } },
                            function(err, user) {
                                if (err) {
                                    reject("existingFilter err", err);
                                } else {
                                    console.log("Aggiunta photo al filter: " + existingFilter.name);
                                    resolve(true);
                                }
                            });
                    } else {
                        console.log("Foto già presente nel filter");
                        resolve(true);
                    }
                }
            }
        });
    });
};

var all = function() {
    console.log("all " + count);
    if (count !== 0) {
        count = count - 1;
        getPhotos()
            .then(
                function(result) {
                    console.log('photo ID');
                    console.log('photo ID', result);
                    if (result.length) {
                        return getFilter(result[0]);
                    } else {
                        return;
                    }
                },
                function(error) {
                    console.log(error);
                })
            .then(
                function() {
                    all();
                },
                function(error) {
                    console.log(error);
                    db.closeConn();
                });
    } else {
        console.log('Tutte le foto sono state elaborate');
        db.closeConn();
    }
};

db.openConn()
    .then(function() {
        return countPhotos();
    })
    .then(
        function(count_photo) {

            count = count_photo;

            start1 = 0;
            start2 = count_photo / 2;

            end1 = count_photo / 2 - 1;
            end2 = count_photo;

            console.log(count_photo);
            // far partie più funzioni in parallelo
            // riduce i tempi di creazione dei filter
            Promise.all([all()]);
        },
        function(error) {
            console.log(error);
        });
