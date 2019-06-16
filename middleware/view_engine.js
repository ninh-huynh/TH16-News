var path = require('path');
var expressLayouts = require('express-ejs-layouts');

module.exports = function (app) {
    // view engine setup
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');                          // explicit default layout: main.ejs
    app.set('layout extractScripts', true);                     // move all script tag to the script section in layout file
    app.set('layout extractStyles', true);                      // same as above    
};

