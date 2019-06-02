var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

// check if the email exists or not
router.post('/check-email', (req, res, next) => {
    var email = req.body.email;
    userModel.checkEmailExists(email).then(isExist => {
        res.send((!isExist).toString());
    }).catch(err => {
        if (err) throw err;
    });
});

// TODO: check every thing else below: existing category, tags, ...

module.exports = router;