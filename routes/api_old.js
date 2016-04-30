var express = require('express');
var request = require('request');
var router = express.Router();
var Photo = require('../models/photo');
var CommentsPhoto = require('../models/comments_photo');
var LikesPhoto = require('../models/likes_photo');
var UsersInPhoto = require('../models/users_in_photo');

var config = require('../config');

// funzione che manda richiesta a instagram tramite delle coordinate
router.post('/queryPhoto', function(req, res) {
    var params = {
        client_id: '0fbcf8f88e6d45b89ae445fd961a752f'
    };
    var instagramId = req.body.instagram_id;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var distance = req.body.distance;
    var url = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '?client_id=' + params.client_id;

    console.log('url', url);

    request.get({
        url: url,
        qs: params,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body.data);
        }
    });
});

// funzione che salva nel db le foto tornate da instagram qualora non fossero presenti
router.post('/savePhoto', function(req, res) {

    var photo = req.body.photo;

    //console.log('photo', photo);

    Photo.findOne({
        id: photo.id
    }, function(err, existingPhoto) {
        if (!existingPhoto) {
            var coords = [];
            console.log('existingPhoto', existingPhoto);

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
                console.log('photoSave', photo.id);
                res.send({
                    photo: photoSave
                });
            });
        } else {
            // [WARNING]
            // UPDATE DI COMMENTI E LIKE SE LA FOTO ESISTE GIA' NEL DB
            console.log('Questa foto già esiste'.error);
            res.status(403).send('Photo exist in DB');
        }
    });
});

// ritorna le foto presenti nel db in base a delle coordinate
router.post('/retrievePhoto', function(req, res) {
    //var maxDist = req.body.maxDist;
    var coords = [req.body.lat, req.body.lng];
    var geo = {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: coords
            },
            $maxDistance: 5000
        }
    }

    console.log(geo);

    Photo.find({
            geo: geo
        },
        function(err, result) {
            if (err) {
                console.log(err);
                res.status(403).send('Non riesco a recuperare foto dal database');
            } else {
                console.log(result);
                res.status(200).send(result);
            }
        });

});
module.exports = router;
