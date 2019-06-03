var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var articleModel = require('../models/articles');

// check if the email exists or not
router.post('/check-email-available', (req, res, next) => {
    var email = req.body.email;
    userModel.checkEmailExists(email).then(isExist => {
        res.send((!isExist).toString());
    }).catch(err => {
        if (err) throw err;
    });
});

router.post('/check-email-exists', (req, res, next) => {
    var email = req.body.email;
    userModel.checkEmailExists(email).then(isExist => {
        res.send((isExist).toString());
    }).catch(err => {
        if (err) throw err;
    });
});

router.post('/check-title-available', (req, res, next) => {
    var title = req.body.title;
    articleModel.checkTitleExits(title)
        .then(isExist => {
            res.send((!isExist).toString());
        }).catch(next);
});


// TODO: check every thing else below: existing category, tags, ...

module.exports = router;