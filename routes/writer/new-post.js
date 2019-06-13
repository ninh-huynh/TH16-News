var express = require('express');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();
var tag = require('../../models/admin/tags');
var post = require('../../models/admin/posts');
var category = require('../../models/categories');

  
  const getBlobName = originalName => {
    // Use a random number to generate a unique file name, 
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, ''); 
    return `${identifier}-${originalName}`;
  };
  

// All path has prefix with '/admin/users'

router.get('/', (req, res, next) => {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('writer/new-post', { layout: 'layouts/manage' });
});

router.get('/category', (req, res, next) => {
    console.log(req.body);
    let promise = category.loadParent();

    promise
        .then(rows => {
            res.send(rows.map(row => ({ id: row.id, name: row.name })));
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.get('/category/:parentCategoryID', (req, res, next) => {
    let parentCategoryID = parseInt(req.params.parentCategoryID);
    let promise = category.loadChild(parentCategoryID);

    promise
        .then((rows) => {
            console.log(rows.map(row => ({ id: row.id, name: row.name })));
            res.send(rows.map(row => ({ id: row.id, name: row.name })));
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.post('/test', (req, res, next) => {

});


module.exports = router;