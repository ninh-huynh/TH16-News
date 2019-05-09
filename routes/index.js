var express = require('express');
var router = express.Router();
var db = require('../utils/db');


/* GET home page. */
router.get('/', function (req, res, next) {
    var p = db.testConnection();

    p.then(msgStr => {
        console.log(msgStr);
        res.render('index');
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;
