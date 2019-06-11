var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var articleModel = require('../models/articles');
var categoryModel = require('../models/categories');
var tagModel = require('../models/tags');
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

router.post('/check-tag-available', (req, res, next) => {
    var tag = req.body.name;
    tagModel.checkTagExists(tag)
        .then(isExist => {
            res.send((!isExist).toString());
        })
        .catch(next);
});

module.exports = router;