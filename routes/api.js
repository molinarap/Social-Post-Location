var express = require('express');
var colors = require('colors');
var request = require('request');
var router = express.Router();
var Bear = require('../models/bear');

var config = require('../config');

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

        // Step 2a. Link user accounts.
        if (req.headers.authorization) {
            User.findOne({
                instagramId: body.user.id
            }, function(err, existingUser) {

                var token = req.headers.authorization.split(' ')[1];
                var payload = jwt.decode(token, config.tokenSecret);

                User.findById(payload.sub, '+password', function(err, localUser) {
                    if (!localUser) {
                        return res.status(400).send({
                            message: 'User not found.'
                        });
                    }

                    // Merge two accounts.
                    if (existingUser) {

                        existingUser.email = localUser.email;
                        existingUser.password = localUser.password;

                        localUser.remove();

                        existingUser.save(function() {
                            var token = createToken(existingUser);
                            return res.send({
                                token: token,
                                user: existingUser
                            });
                        });

                    } else {
                        // Link current email account with the Instagram profile information.
                        localUser.instagramId = body.user.id;
                        localUser.username = body.user.username;
                        localUser.fullName = body.user.full_name;
                        localUser.picture = body.user.profile_picture;
                        localUser.accessToken = body.access_token;

                        localUser.save(function() {
                            var token = createToken(localUser);
                            res.send({
                                token: token,
                                user: localUser
                            });
                        });

                    }
                });
            });
            console.log('body if', body);

        } else {
            User.findOne({
                instagramId: body.user.id
            }, function(err, existingUser) {
                if (existingUser) {
                    var token = createToken(existingUser);
                    return res.send({
                        token: token,
                        user: existingUser
                    });
                }

                var user = new User({
                    instagramId: body.user.id,
                    username: body.user.username,
                    fullName: body.user.full_name,
                    picture: body.user.profile_picture,
                    accessToken: body.access_token
                });

                user.save(function() {
                    var token = createToken(user);
                    res.send({
                        token: token,
                        user: user
                    });
                });
            });
            console.log('body else', body);
        }
    });
});


/*router.route('/prova')
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    })

// create a bear (accessed at POST http://localhost:8080/api/bears)
.post(function(req, res) {

    var bear = new Bear(); // create a new instance of the Bear model
    bear.name = req.body.name; // set the bears name (comes from the request)
    bear.surname = req.body.surname; // set the bears name (comes from the request)

    // save the bear and check for errors
    bear.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'Bear created!'
        });
    });

});*/

module.exports = router;
