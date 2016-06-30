var request = require('request');
var TagCount = require('../models/tag_count');
var FilterCount = require('../models/filter_count');
var Photo = require('../models/photo');
var PopularityPhoto = require('../models/popularity_photo');

var config = require('../config');

var db = require('./../db');

var filters_info = [];

var count;

var photoId;
var popularity = 0;
var popFilter = 0;
var popTags = 0;
var popLike = 0;
var popComment = 0;

var countPhotos = function() {
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

var getLikeCommentsPhotos = function(likes, comments) {
    return new Promise(function(resolve, reject) {
        console.log("getLikeCommentsPhotos " + count);

        var l = JSON.parse(likes);
        var c = JSON.parse(comments);
        popLike = l.count;
        popComment = c.count;
        var sum = popLike + popComment;
        resolve(sum);
    });
};

var getPopularityFilter = function(photoFilter) {
    return new Promise(function(resolve, reject) {
        console.log("getPopularityFilter " + count);
        FilterCount.findOne({
            name: photoFilter
        }, function(err, existingFilter) {
            if (err) {
                reject(err);
            } else {
                popFilter = popFilter + existingFilter.popularity;
                resolve(popFilter);
            }
        });
    });
};

var getPopularityTag = function(photoTag) {
    return new Promise(function(resolve, reject) {
        console.log("getPopularityTag " + count);
        console.log("photoTag " + photoTag);

        TagCount.findOne({
            name: photoTag
        }, function(err, existingTags) {
            if (err) {
                reject(err);
            } else {
                popTags = popTags + existingTags.popularity;
                resolve(popTags);
            }
        });
    });
};

var getPopularityTags = function(tags) {
    return new Promise(function(resolve, reject) {
        console.log("getPopularityTag " + count);
        if (tags.length) {
            tags.forEach(function(tag, index) {
                getPopularityTag(tag)
                    .then(function(popTags) {
                            if (index + 1 === tags.length) {
                                console.log("TAG COMPLETATI");
                                resolve(popTags);
                            }
                        },
                        function(error) {
                            reject(error);
                        });
            });
        } else {
            resolve(0);

        }
    });
};

var setPopularityPhoto = function(popularity) {
    return new Promise(function(resolve, reject) {
        var p = popularity;
        console.log("setPopularityPhoto " + count);
        PopularityPhoto.findOne({
            id: photoId
        }, function(err, existingPopularity) {
            if (err) {
                reject(err);
            } else {
                if (!existingPopularity) {
                    console.log('NOT existingPopularity');
                    var popSave = new PopularityPhoto({
                        id: photoId,
                        popularity: p
                    });
                    popSave.save(function(result) {
                        console.log('Nuova popolarità foto aggiunta');
                        resolve(true);
                    });
                } else {
                    console.log('existingPopularity');
                    if (p != existingPopularity.popularity) {
                        console.log('existingPopularity -----------------> ' + photoId);
                        PopularityPhoto.update({ id: photoId }, { $set: { 'popularity': p } },
                            function(err, user) {
                                if (err) {
                                    reject("existingPopularity err", err);
                                } else {
                                    console.log("Aggiunta popularity alla photo: " + existingPopularity.id);
                                    resolve(true);
                                }
                            });
                    } else {
                        console.log("Stessa popularity");
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
                    //promise all di tutte le funzioni che calcolano la popolarità
                    photoId = result[0].id;
                    popularity = 0;
                    popFilter = 0;
                    popTags = 0;
                    popLike = 0;
                    popComment = 0;
                    return Promise.all([
                        getPopularityFilter(result[0].filter),
                        getLikeCommentsPhotos(result[0].likes, result[0].comments),
                        getPopularityTags(result[0].tags)
                    ]);
                },
                function(error) {
                    console.log(error);
                })
            .then(
                function(value) {
                    console.log('filter', value[0]);
                    console.log('likes-comments', value[1]);
                    console.log('tags', value[2]);
                    popularity = value[0] + value[1] + value[2];
                    console.log('popularity', popularity);
                    return setPopularityPhoto(popularity);
                },
                function(error) {
                    console.log(error);
                    db.closeConn();
                }).then(function(argument) {
                all();
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
