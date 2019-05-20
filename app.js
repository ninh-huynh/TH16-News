var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var menu_bar = require('./middleware/menu_bar');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');                          // explicit default layout: main.ejs
app.set('layout extractScripts', true);                     // move all script tag to the script section in layout file
app.set('layout extractStyles', true);                      // same as above

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));           // for parsing req.body infomation
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    // set 'public' folder as folder contain static file: css, script, image...

app.use(menu_bar);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
