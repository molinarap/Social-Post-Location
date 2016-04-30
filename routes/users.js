var express = require('express');
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var router = express.Router();
var User = require('../models/user');

var config = require('../config');
var db = require('./../db');

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
    });
};

/* GET users listing. */
router.route('/')
    .get(function(req, res, next) {
        res.send('respond with a resource');
    });

router.post('/auth/instagram', function(req, res) {
    db.openConn();
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.clientSecret,
        code: req.body.code,
        grant_type: 'authorization_code'
    };


    // Step 1. Exchange authorization code for access token.
    request.post({
        url: accessTokenUrl,
        form: params,
        json: true
    }, function(error, response, body) {


        User.findOne({
            instagramId: body.user.id
        }, function(err, existingUser) {
            if (!existingUser) {
                var user = new User({
                    instagramId: body.user.id,
                    username: body.user.username,
                    fullName: body.user.full_name,
                    name: body.user.name,
                    surname: body.user.surname,
                    picture: body.user.profile_picture,
                    accessToken: body.access_token
                });

                user.save(function(err, user) {
                    if (err) {
                        console.log("err", err);
                        res.status(403).send(err);
                    } else {
                        var token = createToken(user);
                        console.log('Utente salvato');
                        res.status(200).send({
                            token: token,
                            user: user
                        });
                    }

                });
                //db.closeConn();
            } else {
                if (body.user.profile_picture !== existingUser.picture) {
                    User.update({ instagramId: body.user.id }, { $set: { picture: body.user.profile_picture } },
                        function(err, user) {
                            if (err) {
                                console.log("err", err);
                            } else {
                                console.log("Aggiornata immagine profilo");
                            }
                        });
                    existingUser.picture = body.user.profile_picture;
                }
                var token = createToken(existingUser);
                return res.status(200).send({
                    token: token,
                    user: existingUser
                });
                //db.closeConn();
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



module.exports = router;
