var express = require('express');
var router = express.Router();
var filestore = require('../modules/filestore');

var monk = require('monk');
var db = monk('localhost:27017/hotlist');

router.get('/equipment', function(req, res) {
    var collection = db.get('equipment');
    collection.find( {}, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
});

router.get('/equipment/:id', function(req, res) {
    var collection = db.get('equipment');
    collection.findOne({ _id: req.params.id }, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
});

router.post('/equipment', function(req, res) {
    var collection = db.get('equipment');
    collection.insert({
        createdDate: new Date(),
        name: req.body.name,
        sku: req.body.sku,
        category: req.body.category,
        rating: Number(req.body.rating)
    }, function(err, equipment) {
        if(err) throw err;
        res.json(equipment);
    });
});

router.put('/equipment/:id', function(req, res) {
    var collection = db.get('equipment');

    collection.update({ _id: req.params.id }, 
    { $set:
        {
            updatedDate: new Date(),
            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            rating: Number(req.body.rating),
            fileName: req.body.fileName            
        }
    }, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
});

router.post('/equipment/:id/image', function(req, res) {
    var collection = db.get('equipment');
    
    filestore.upload(req, res, function(err) {
        if (err) {
            console.log('error uploading file: ' + err);
            return;
        }
        collection.update({ _id: req.params.id },
        { $set:
            {
                updatedDate: new Date(),
                fileName: req.file.filename
            }
        }, function(err, equipment) {
            res.json(equipment);
        });
    });
});

router.delete('/equipment/:id/image', function(req, res) {
    var collection = db.get('equipment');
 
    collection.update({ _id: req.params.id },
    { $set:
        {
            fileName: null
        }
    }, function(err, equipment) {
        res.json(equipment);
    });
});

router.delete('/equipment/:id', function(req, res) {
    var collection = db.get('equipment');
    collection.remove({ _id: req.params.id }, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
});

module.exports = router;