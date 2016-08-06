var express = require('express');
var router = express.Router();
var equip = require('../controllers/equipments');

var monk = require('monk');
var db = monk('localhost:27017/hotlist');

router.get('/equipment', equip.findAll);
router.get('/equipment/:id', equip.findById);
router.post('/equipment', equip.add);
router.put('/equipment/:id', equip.update);
router.post('/equipment/:id/image');
router.post('/equipment/:id/image', equip.addImage);
router.delete('/equipment/:id', equip.delete);
router.delete('/equipment/:id/image', equip.deleteImage);

module.exports = router;