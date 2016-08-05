var monk = require('monk');
var db = monk('localhost:27017/hotlist');
var filestore = require('../modules/filestore');

exports.findAll = function(req, res){
    var collection = db.get('equipment');
    collection.find( {}, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
};

exports.findById = function(req, res) {
    var collection = db.get('equipment');
    collection.findOne({ _id: req.params.id }, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
};

exports.add = function(req, res) {
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
};

exports.update = function(req, res) {
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
};

exports.delete = function(req, res) {
    var collection = db.get('equipment');
    collection.remove({ _id: req.params.id }, function(err, equipment) {
        if (err) throw err;
        res.json(equipment);
    });
}

exports.deleteImage = function(req, res) {
    var collection = db.get('equipment');
 
    collection.update({ _id: req.params.id },
    { $set:
        {
            fileName: null
        }
    }, function(err, equipment) {
        res.json(equipment);
    });
};

exports.addImage = function(req, res) {
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
};