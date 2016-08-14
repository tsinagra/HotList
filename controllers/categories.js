
var pg = require('pg');
var connString = 'postgres://tsinagra@localhost/hotlist';

exports.findAll = function(req, res) {
    var results = [];

    // get a postgres client from the connection pool
    pg.connect(connString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send(json({ success: false, data: err }));
        }

        // client.query('SELECT * FROM category ORDER BY id ASC', function(err, results) {
        //     done();
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log(results.rows);
        //     return res.json(results.rows);
        // });

        var query = client.query('SELECT * FROM category ORDER BY id ASC;');
        // stream results back one at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // after all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
};