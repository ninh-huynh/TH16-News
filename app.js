var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var passport = require('passport');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var writerRouter = require('./routes/writer');
var categoryRouter = require('./routes/category');
var tagRouter = require('./routes/tag');
var searchRouter = require('./routes/search');
var accountRouter = require('./routes/account');
var articleRouter = require('./routes/article');
var menu_bar = require('./middleware/menu_bar');
var form_validate = require('./middleware/form-validate');
var linkHelper = require('./utils/linkHelper');
var moment = require('moment');
moment.locale('vi');

var app = express();


app.locals.concatToLink = linkHelper.concatToLink;          // pass concatToLink() to view, able to call directly in any view
app.locals.moment = moment;
app.locals.publicDateFormat = 'DD/MM/YYYY';

require('./middleware/view_engine')(app);
require('./middleware/session')(app);
require('./middleware/passport')(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));           // for parsing req.body infomation
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    // set 'public' folder as folder contain static file: css, script, image...

app.use(menu_bar);
app.use(form_validate);
app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/tags', tagRouter);
app.use('/admin', adminRouter);
app.use('/writer', writerRouter);
app.use('/search', searchRouter);
app.use('/account', accountRouter);
app.use(articleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { layout: 'layouts/empty', extractScripts: false, extractStyles: false });
});

module.exports = app;
