var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var accountModel = require('./../models/account');

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

    passport.use(ls);

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
};