var express = require('express');
var colors = require('colors');
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var CommentsPhoto = require('../models/comments_photo');
var LikesPhoto = require('../models/likes_photo');
var UsersInPhoto = require('../models/users_in_photo');

var config = require('../config');

var createToken = function(user) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user._id
    };

    return jwt.encode(payload, config.tokenSecret);
};

var isAuthenticated = function(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).send({
            message: 'You did not provide a JSON Web Token in the Authorization header.'
        });
    }

    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();

    if (now > payload.exp) {
        return res.status(401).send({
            message: 'Token has expired.'
        });
    }

    User.findById(payload.sub, function(err, user) {
        if (!user) {
            return res.status(400).send({
                message: 'User no longer exists.'
            });
        }

        req.user = user;
        next();
    })
};

/* GET users listing. */
router.route('/')
    .get(function(req, res, next) {
        res.send('respond with a resource');
    });

router.post('/auth/instagram', function(req, res) {
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.clientSecret,
        code: req.body.code,
        grant_type: 'authorization_code'
    };

    console.log('params', params);

    // Step 1. Exchange authorization code for access token.
    request.post({
        url: accessTokenUrl,
        form: params,
        json: true
    }, function(error, response, body) {


        User.findOne({
            instagramId: body.user.id
        }, function(err, existingUser) {
            console.log('!existingUser', existingUser);

            if (!existingUser) {
                console.log('!existingUser', existingUser);
                var user = new User({
                    instagramId: body.user.id,
                    username: body.user.username,
                    fullName: body.user.full_name,
                    name: body.user.name,
                    surname: body.user.surname,
                    picture: body.user.profile_picture,
                    accessToken: body.access_token
                });

                user.save(function() {
                    console.log('user', user);
                    var token = createToken(user);
                    res.send({
                        token: token,
                        user: user
                    });
                });
            } else {
                console.log('existingUser', existingUser);
                var token = createToken(existingUser);
                return res.send({
                    token: token,
                    user: existingUser
                });
            }
        });
    });
});

router.post('/myphoto', isAuthenticated, function(req, res) {
    var params = {
        access_token: req.user.accessToken
    };
    var instagramId = req.body.instagram_id;
    console.log('instagramId', instagramId);

    var feedUrl = 'https://api.instagram.com/v1/users/' + instagramId + '/media/recent?access_token=' + params.access_token;

    console.log('feedUrl', feedUrl);

    request.get({
        url: feedUrl,
        qs: params,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body.data);
        }
    });
});

router.post('/locationPhoto', isAuthenticated, function(req, res) {
    var params = {
        access_token: req.user.accessToken
    };
    var instagramId = req.body.instagram_id;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var distance = req.body.distance;
    var locationUrl = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&distance=' + distance + '&access_token=' + params.access_token;
    //var locationUrl = 'https://api.instagram.com/v1/locations/' + 616736 + '/media/recent?access_token=' + params.access_token;

    console.log('locationUrl', locationUrl);

    request.get({
        url: locationUrl,
        qs: params,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body.data);
        }
    });
});

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

router.post('/savePhoto', function(req, res) {

    var photo = req.body.photo;

    //console.log('photo', photo);

    Photo.findOne({
        id: photo.id
    }, function(err, existingPhoto) {
        //console.log('!existingPhoto', existingPhoto);
        if (!existingPhoto) {
            //console.log('!existingPhoto', existingPhoto);

            var comments = [];
            var likes = [];
            var users = [];
            var coords = [];

            if (photo.comments.count !== 0) {
                for (var i = 0; i < photo.comments.data.length; i++) {
                    var comments_photo = new CommentsPhoto({
                        id: photo.comments.data[i].id,
                        text: photo.comments.data[i].text,
                        created_time: photo.comments.data[i].created_time,
                        from: {
                            full_name: photo.comments.data[i].from,
                            id: photo.comments.data[i].from.id,
                            profile_picture: photo.comments.data[i].from.profile_picture,
                            username: photo.comments.data[i].from.username
                        }
                    });
                    comments.push(comments_photo);
                }
            }

            if (photo.likes.count !== 0) {

                for (var i = 0; i < photo.likes.data.length; i++) {
                    var likes_photo = new LikesPhoto({
                        id: photo.likes.data[i].id,
                        full_name: photo.likes.data[i].full_name,
                        profile_picture: photo.likes.data[i].profile_picture,
                        username: photo.likes.data[i].username
                    });
                    likes.push(likes_photo);
                }
            }



            for (var i = 0; i < photo.users_in_photo.length; i++) {
                var users_in_photo = new UsersInPhoto({
                    position: {
                        x: photo.users_in_photo[i].position.x,
                        y: photo.users_in_photo[i].position.y,
                    },
                    user: {
                        full_name: photo.users_in_photo[i].user.full_name,
                        id: photo.users_in_photo[i].user.id,
                        profile_picture: photo.users_in_photo[i].user.profile_picture,
                        username: photo.users_in_photo[i].user.username
                    }
                });
                users.push(users_in_photo);
            }
            coords[0] = photo.location.longitude || 0;
            coords[1] = photo.location.latitude || 0;

            var photoSave = new Photo({
                id: photo.id || null,
                caption: {
                    created_time: photo.caption.created_time || null,
                    from: {
                        full_name: photo.caption.from.full_name || null,
                        id: photo.caption.from.id || null,
                        profile_picture: photo.caption.from.profile_picture || null,
                        username: photo.caption.from.username || null
                    },
                    id: photo.caption.id || null,
                    text: photo.caption.text || null
                },
                comments: {
                    count: photo.comments.count || null,
                    data: comments || []
                },
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
                likes: {
                    count: photo.likes.count || null,
                    data: likes || []
                },
                link: photo.link || null,
                location: {
                    id: photo.location.id || null,
                    latitude: photo.location.latitude || null,
                    longitude: photo.location.longitude || null,
                    name: photo.location.name || null
                },
                tags: photo.tags || [],
                type: photo.type || null,
                user: {
                    full_name: photo.user.full_name || null,
                    id: photo.user.id || null,
                    profile_picture: photo.user.profile_picture || null,
                    username: photo.user.username || null
                },
                users_in_photo: users || null
                    /*geo: {
                        type: coords                
                    }*/
            });

            photoSave.save(function(result) {
                console.log('photoSave', photoSave);
                res.send({
                    photo: photoSave
                });
            }, function(error) {
                console.log('ERROR', error);
                res.send({
                    error: error
                });
            });
        } else {
            console.log('existingPhoto', existingPhoto);
            console.log('existingPhoto', 'photo existed in db');
        }
    });
});
module.exports = router;