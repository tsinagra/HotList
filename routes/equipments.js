var express = require('express');
var router = express.Router();
var equip = require('../controllers/equipments');

var monk = require('monk');
var db = monk('localhost:27017/hotlist');

router.get('/equipment', function(req, res) {
    equip.findAll(req, res);
});

router.get('/equipment/:id', function(req, res) {
    equip.findById(req, res);
});

router.post('/equipment', function(req, res) {
    equip.add(req, res);
});

router.put('/equipment/:id', function(req, res) {
    equip.update(req, res);
});

router.post('/equipment/:id/image', function(req, res) {
    equip.addImage(req, res);
});

router.delete('/equipment/:id/image', function(req, res) {
    equip.deleteImage(req, res);
});

router.delete('/equipment/:id', function(req, res) {
    equip.delete(req, res);
});

module.exports = router;