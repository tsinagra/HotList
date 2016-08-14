var express = require('express');
var router = express.Router();
var categories = require('../controllers/categories');

router.get('/category', categories.findAll);

module.exports = router;