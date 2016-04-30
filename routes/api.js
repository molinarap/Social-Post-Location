var express = require('express');
var request = require('request');
var router = express.Router();
var Photo = require('../models/photo');

var config = require('../config');

var db = require('./../db');

router.post('/download-show-photos', function(req, res) {

    var lat = req.body.lat;
    var lng = req.body.lng;

    var photoInstagram = [];

    // 1.
    // funzione che interroga instagram a cui vengono passate delle coordinate
    // per farsi tornare le foto in un range di 5 km
    var photosFromInsta = function(lat, lng) {
        return new Promise(function(resolve, reject) {
            var params = {
                client_id: '0fbcf8f88e6d45b89ae445fd961a752f'
            };
            var distance = 5000;
            var url = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '?client_id=' + params.client_id;

            request.get({
                url: url,
                qs: params,
                json: true
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Le foto sono state scaricate");
                    resolve(body.data);
                } else {
                    console.log('Instagram non risponde');
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
                console.log('La foto già esiste');
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
    var photosFromDb = function(lat, lng) {
        return new Promise(function(resolve, reject) {
            var coords = [lat, lng];
            var geo = {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: coords
                    },
                    $maxDistance: 5000,
                    $center: coords,
                }
            }

            var query = Photo.find({ geo: geo }).limit(500);
            query.exec(function(err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    };

    Promise
        .all([photosFromInsta(req.body.lat, req.body.lng), db.openConn()])
        .then(function(value) {
            console.log('Inizio a salvare le foto nel db...');
            var photos = value[0];
            saveAllPhotos(photos);
        }, function(reason) {
            console.log('Mi dispiace ci sta qualche problema!');
        }).then(function(results) {
            return photosFromDb(req.body.lat, req.body.lng);
            console.log('Ora richiamo le foto dal db', results);
        }).then(function(results1) {
            var allPhoto = results1.concat(photoInstagram);
            res.status(200).send(allPhoto);
            console.log('Foto scaricate', allPhoto.length);
            db.closeConn();
        }, function(error) {
            console.log('error', error);
            res.status(403).send('Non riesco a recuperare foto dal database');
            db.closeConn();
        });

});
module.exports = router;
