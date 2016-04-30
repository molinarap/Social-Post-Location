var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./app/html/index.html');
});

/* GET insta thanks page. */
router.get('/thanks', function(req, res, next) {
  res.sendfile('./app/html/thanks.html');
});

module.exports = router;
