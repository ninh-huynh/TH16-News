var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var accountModel = require('./../models/account');
var userRoleModel = require('../models/user_role');
var router = express.Router();
var userModel = require('./../models/users');
var moment = require('moment');

const SALT_ROUND = 10;

router.post('/sign-up', (req, res, next) => {
    const email = req.body.email;
    const dateOfBirth = req.body.birthday;
    const name = req.body.fullName;
    const plainTextPassword = req.body.newPass;

    bcrypt
        .hash(plainTextPassword, SALT_ROUND)
        .then(hash => {
            const newReader = {
                name: name,
                email: email,
                dateOfBirth: dateOfBirth,
                password: hash
            };
            console.log(newReader);
            accountModel.addReader(newReader);
        })
        .then(rows => {
            let backURL = req.header('Referer') || '/';
            res.redirect(backURL);
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        let retURL = req.headers['Origin'] || '/';
        if (!user) {
            //return res.send(info);
            res.render('_widget/error-alert', { layout: 'layouts/empty', message: info });
        }

        let backURL = req.header('Referer') || '/';
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }

            //return res.send({ valid: true });
            res.render('_widget/success-alert', { layout: 'layouts/empty', message: 'Đăng nhập thành công' });
        });
    })(req, res, next);
});

// https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/login/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/login/google',
    passport.authenticate('google',
        {
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }));

router.get('/login/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/info', (req, res, next) => {
    var userEntity = req.user;

    if (userEntity === undefined) {
        var err = new Error('Bạn phải đăng nhập mới có thể truy cập trang này');
        err.status = 401;
        next(err);
        return;
    }

    userRoleModel.getName(userEntity.roleID)
        .then(roleName => {
            var user = {};
            Object.assign(user, userEntity);
            res.locals.updateSuccessfull = false;
            user.role = roleName;
            res.render('account-info', { user });
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.post('/info', (req, res, next) => {
    var userSessionInfo = req.user;
    if (userSessionInfo === undefined) {
        var err = new Error('Bạn không có quyền thực hiện thao tác này');
        err.status = 403;
        next(err);
        return;
    }

    var user = req.body;
    user.id = userSessionInfo.id;
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    userModel.update(user)
        .then(affectedRow => {
            var updateSuccessfull = true;
            res.render('account-info', { updateSuccessfull, userSessionInfo });
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.post('/change-pass', (req, res, next) => {
    var userSessionInfo = req.user;
    if (userSessionInfo === undefined) {
        var err = new Error('Bạn không có quyền thực hiện thao tác này');
        err.status = 403;
        next(err);
        return;
    }

    var user = req.body;
    bcrypt.hash(user.newPass, SALT_ROUND)
        .then(hash => {
            let updateUser = {
                id: userSessionInfo.id,
                password: hash,
            };
            return userModel.update(updateUser);
        })
        .then(affectedRow => {
            res.redirect('info');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;