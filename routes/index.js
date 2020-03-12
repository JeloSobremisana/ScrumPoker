var express = require('express');
var router = express.Router();
var cards = require('../helpers/cards');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/register');
});

router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Register'});
});

router.get('/scrum-poker', function(req, res, next) {
  res.render('scrum-cards', { title: 'Play', cards: cards});
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard', { title: 'Dashboard'});
});
module.exports = router;
