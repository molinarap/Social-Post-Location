var request = require('request');
var TagCount = require('../models/tag_count');
var Photo = require('../models/photo');

var config = require('../config');

var db = require('./../db');

var tags_info = [];

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

var getTags = function(photo) {
    return new Promise(function(resolve, reject) {
        console.log("getTags " + count);
        var photo_tags = photo.tags;
        if (photo_tags.length) {
            photo_tags.forEach(function(tag, index) {
                TagCount.findOne({
                    name: tag
                }, function(err, existingTag) {

                    if (err) {
                        reject(err);
                    } else {
                        if (!existingTag) {
                            console.log('NOT existingTag');
                            var tagSave = new TagCount({
                                name: tag,
                                popularity: 0,
                                photo_id: []
                            });
                            tagSave.photo_id.push(photo.id);
                            tagSave.popular = tagSave.photo_id.length;
                            tagSave.save(function(result) {
                                console.log('Nuovo Tag aggiunto');
                            });
                        } else {
                            console.log('existingTag');
                            if (!contains(photo.id, existingTag.photo_id)) {
                                console.log('existingTag -----------------> ' + photo.id);
                                existingTag.photo_id.push(photo.id);
                                TagCount.update({ name: tag }, { $set: { 'photo_id': existingTag.photo_id, 'popularity': existingTag.photo_id.length } },
                                    function(err, user) {
                                        if (err) {
                                            reject("existingTag err", err);
                                        } else {
                                            console.log("Aggiunta photo al tag: " + existingTag.name);
                                        }
                                    });
                            } else {
                                console.log("Foto già presente nel tag");
                                //resolve(photo.tags);
                            }
                        }
                    }
                });
                if (index + 1 === photo_tags.length) {
                    console.log("TAG COMPLETATI");
                    resolve(true);
                }
            });
        } else {
            resolve(photo.tags);
            console.log("FOTO SENZA TAG");
        }
    });
};

var all = function() {
    console.log("all " + count);
    if (count !== 0) {
        count = count - 1;
        getPhotos()
            .then(
                function(result) {
                    console.log('photo ID', result[0].id);
                    return getTags(result[0]);
                },
                function(error) {
                    console.log(error);
                })
            .then(
                function(result1) {
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
            // riduce i tempi di creazione dei tag
            Promise.all([all()]);
        },
        function(error) {
            console.log(error);
        });
