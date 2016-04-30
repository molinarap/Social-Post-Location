var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./app/index.html');
});

router.get('/thanks', function(req, res, next) {
  res.sendfile('./app/thanks.html');
});

module.exports = router;
