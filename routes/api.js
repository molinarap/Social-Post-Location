var express = require('express');
var request = require('request');
var router = express.Router();
var Photo = require('../models/photo');

var config = require('../config');

var db = require('./../db');

router.post('/download-show-photos', function(req, res) {

    var lat = req.body.lat;
    var lng = req.body.lng;
    var page = req.body.pg;
    var distance = req.body.dist;
    var accessToken = req.body.access_token;

    var photoInstagram = [];

    // 1.
    // funzione che interroga instagram a cui vengono passate delle coordinate
    // per farsi tornare le foto in un range di 5 km
    var photosFromInsta = function(lat, lng, distance, at) {
        return new Promise(function(resolve, reject) {
            var params = {
                client_id: config.client_id_newAPI
            };
            var distance = 1000;
            var url = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '&access_token=' + at;
            console.log(url);
            request.get({
                url: url,
                json: true
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Le foto sono state scaricate");
                    resolve(body.data);
                } else {
                    console.log('Instagram non risponde', error);
                    reject(error);
                }
            });
        });
    };

    // 2.
    // funzione che prende una foto e la salva sul database 
    // qualora non fosse prensete (controllo l'id)
    var savePhotos = function(photo) {
        Photo.findOne({
            id: photo.id
        }, function(err, existingPhoto) {
            if (!existingPhoto) {
                var coords = [];

                var c = JSON.stringify(photo.comments);
                var l = JSON.stringify(photo.likes);

                if (photo.caption) {
                    var caption = {
                        created_time: photo.caption.created_time || null,
                        from: {
                            full_name: photo.caption.from.full_name || null,
                            id: photo.caption.from.id || null,
                            profile_picture: photo.caption.from.profile_picture || null,
                            username: photo.caption.from.username || null
                        },
                        id: photo.caption.id || null,
                        text: photo.caption.text || null
                    };
                }

                if (photo.location) {
                    var location = {
                        id: photo.location.id || null,
                        latitude: photo.location.latitude || null,
                        longitude: photo.location.longitude || null,
                        name: photo.location.name || null
                    };
                    coords[0] = photo.location.latitude || 0;
                    coords[1] = photo.location.longitude || 0;
                }

                var photoSave = new Photo({
                    id: photo.id || null,
                    caption: caption || null,
                    created_time: photo.created_time || null,
                    filter: photo.filter || null,
                    images: {
                        low_resolution: {
                            height: photo.images.low_resolution.height || null,
                            url: photo.images.low_resolution.url || null,
                            width: photo.images.low_resolution.width || null
                        },
                        standard_resolution: {
                            height: photo.images.standard_resolution.height || null,
                            url: photo.images.standard_resolution.url || null,
                            width: photo.images.standard_resolution.width || null
                        },
                        thumbnail: {
                            height: photo.images.thumbnail.height || null,
                            url: photo.images.thumbnail.url || null,
                            width: photo.images.thumbnail.width || null
                        },
                    },
                    link: photo.link || null,
                    location: location || null,
                    tags: photo.tags || [],
                    type: photo.type || null,
                    user: {
                        full_name: photo.user.full_name || null,
                        id: photo.user.id || null,
                        profile_picture: photo.user.profile_picture || null,
                        username: photo.user.username || null
                    },
                    comments: c,
                    likes: l,
                    geo: {
                        coordinates: [coords[0], coords[1]]
                    }
                });

                photoSave.save(function(result) {
                    console.log('La foto è stata salvata');
                });
            } else {
                if (photo.user.profile_picture !== existingPhoto.user.profile_picture) {
                    Photo.update({ id: photo.id }, { $set: { 'user.picture': photo.user.profile_picture } },
                        function(err, user) {
                            if (err) {
                                console.log("err", err);
                            } else {
                                console.log("La foto esiste: aggiornata immagine profilo");
                            }
                        });
                    existingPhoto.picture = photo.user.profile_picture;
                } else {
                    console.log('La foto già esiste');
                }
            }
        });
    };

    // 3.
    // funzione che dato un array richiama la funzione che salva 
    // le foto tante volte quanto è la lunghezza dell'array
    var saveAllPhotos = function(photos) {
        return new Promise(function(resolve, reject) {
            photoInstagram = photos;
            for (var i = 0; i < photos.length; i++) {
                savePhotos(photos[i]);
                if (i === photos.length - 1) {
                    resolve(true);
                }
            }
        });
    };

    // 4.
    // funzione che prende come valori delle coordinate
    // e interroga il db per farsi tornare tutte le foto in un range di 5 km
    var photosFromDb = function(lat, lng, page, distance) {
        return new Promise(function(resolve, reject) {
            var coords = [lat, lng];
            var p = page * 300;
            var d = distance * 5000;

            var geo = {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: coords
                    },
                    $maxDistance: d,
                    $center: coords,
                }
            };

            var query = Photo.find({ geo: geo }).skip(p).limit(300).sort('created_time');
            query.exec(function(err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    };

    var contains = function(objId, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === objId) {
                return true;
            }
        }

        return false;
    };

    Promise
        .all([
            photosFromInsta(lat, lng, distance, accessToken),
            // photosFromInsta(req.body.lat, req.body.lng), 
            // photosFromInsta(req.body.lat, req.body.lng), 
            // photosFromInsta(req.body.lat, req.body.lng),
            db.openConn()
        ])
        .then(function(value) {
            console.log('Inizio a salvare le foto nel db...');
            var photos0 = value[0];
            saveAllPhotos(photos0);
            // var photos1 = value[1];
            // saveAllPhotos(photos1);
            // var photos2 = value[2];
            // saveAllPhotos(photos2);
            // var photos3 = value[3];
            // saveAllPhotos(photos3);
        }, function(reason) {
            console.log('Mi dispiace ci sta qualche problema!');
        }).then(function(results) {
            console.log('Ora richiamo le foto dal db', results);
            return photosFromDb(lat, lng, page, distance);
        }).then(function(results1) {
            //var allPhoto = results1.concat(photoInstagram);
            for (var i = 0; i < results1.length; i++) {
                if (!contains(results1[i].id, photoInstagram)) {
                    photoInstagram.push(results1[i]);
                }
            }
            res.status(200).send(photoInstagram);
            console.log('Foto scaricate', photoInstagram.length);
            db.closeConn();
        }, function(error) {
            console.log('error', error);
            res.status(403).send('Non riesco a recuperare foto dal database');
            db.closeConn();
        });

});
module.exports = router;
