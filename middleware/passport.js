var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var accountModel = require('./../models/account');
var configAuth = require('./../config/auth');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        accountModel.getSingleByEmail(email)
            .then(rows => {
                if (rows.length === 0) {
                    return done(null, false, 'Email hoặc mật khẩu không chính xác');
                }

                var user = rows[0];
                var ret = bcrypt.compareSync(password, user.password);
                if (ret) {
                    return done(null, user);
                }

                return done(null, false, 'Email hoặc mật khẩu không chính xác');
            })
            .catch(err => {
                console.log(err);
            });
    });

    var fs = new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
    }, (accessToken, refreshToken, profile, done) => {
        accountModel.getSingleByFacebookID(profile.id)
            .then(rows => {
                if (rows.length === 0) {      // chưa từng đăng nhập bằng Facebook
                    const newUser = {
                        facebookID: profile.id,
                        name: profile.displayName,
                        //email: profile.emails[0].value
                    };
                    accountModel.addSingle(newUser)
                        .then(() => {
                            return done(null, newUser);
                        });
                }

                var user = rows[0];
                return done(null, user);
            })
            .catch(err => {
                console.log(err);
            });
    });

    var gs = new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        accountModel.getSingleByGoogleID(profile.id)
            .then(rows => {
                if (rows.length === 0) {      // chưa từng đăng nhập bằng Google
                    const newUser = {
                        googleID: profile.id,
                        name: profile.displayName,
                        //email: profile.emails[0].value
                    };
                    accountModel.addSingle(newUser)
                        .then(() => {
                            return done(null, newUser);
                        });
                } else {
                    var user = rows[0];
                    return done(null, user);
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

    passport.use(ls);
    passport.use(fs);
    passport.use(gs);


    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
};