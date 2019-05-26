var express = require('express');
var router = express.Router();
var category = require('../models/categories');           // import category model
var linkHelper = require('../utils/linkHelper');

// handle read category
router.get('/categories', function (req, res, next) {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('admin/categories', { layout: 'layouts/manage' }); 
});

router.get('/categories/load', (req, res, next) => {
    var promise = category.load();
    promise
        .then(rows => {
            res.send(rows); 
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

// handle add, update, delete category
router.post('/categories', function (req, res, next) {
    var newCategory = {
        name: req.body.name,
        // parentID: parseInt(req.body.parentID) //TODO: set the <option value="id">  this id is the category id.
        path: '/categories/' + req.body.name
    };
    
    var promise = category.add(newCategory);

    promise
        .then(insertedID => {
            console.log(insertedID);
            res.redirect('/admin/categories');
            // TODO: should pop-up a toast to notify success or not
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

// TODO: implement the 'path' below so when the user access localhost:3000/admin/'path', 
// the web server return the correct html
// Feel free to modify the ejs file content, ejs file name (must inside the views)

// get('/tags')
// get('/posts')
// get('/users') may be later, didn't have User table yet.

module.exports = router;