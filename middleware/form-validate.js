var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var articleModel = require('../models/articles');
var categoryModel = require('../models/categories');

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

router.post('/check-category-available', (req, res, next) => {
    var category = req.body.name;
    categoryModel.checkCategoryExits(category)
        .then(isExist => {
            res.send((!isExist).toString());
        })
        .catch(next);
});

// TODO: check every thing else below: existing category, tags, ...

module.exports = router;