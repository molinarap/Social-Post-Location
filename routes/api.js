var express = require('express');
var router = express.Router();
var Bear = require('../models/bear');

/* GET users listing. */
router.route('/')
    .get(function(req, res, next) {
        res.send('respond with a resource');
    });

router.route('/prova')
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

});

module.exports = router;
