var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var accountModel = require('./../models/account');
var router = express.Router();

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
    passport.authenticate('local', function(err, user, info) {
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
router.get('/login/facebook', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect: '/',
        failureRedirect: '/' 
    }));

router.get('/login/google',
    passport.authenticate('google', 
        { scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ] 
        }));

router.get('/login/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });
    

module.exports = router;