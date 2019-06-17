var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var articleModel = require('../models/articles');
var categoryModel = require('../models/categories');
var tagModel = require('../models/tags');
var bcrypt = require('bcrypt');

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

router.post('/check-password', (req, res, next) => {
    var userSessionInfo = req.user;
    var password = req.body.password;
    console.log(req.body);
    
    if (userSessionInfo === undefined)
    {
        var err = new Error('Bạn không có quyền thực hiện thao tác này');
        err.status = 403;
        next(err);
        return;
    }

    userModel.loadById(userSessionInfo.id)
        .then(user => {
            var isPasswordCorrect = bcrypt.compareSync(password, user.password);
            res.send(isPasswordCorrect.toString());
        })
        .catch(err => {
            console.log(err);
        });
});
module.exports = router;