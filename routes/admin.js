var express = require('express');
var router = express.Router();
var category = require('../models/categories');           // import category model

// handle read category
router.get('/categories', function (req, res, next) {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('admin/categories', { layout: 'layouts/manage' }); 
});

router.get('/categories/load', (req, res, next) => {
    let promise;

    switch(req.query.load) {
    case 'all':
        promise = category.load();
        break;

    case 'parent':
        promise = category.loadParent();
        break;

    case 'child':
        promise = category.loadChild(req.query.parentId);
        break;
    default:
    }

    promise
        .then(rows => {
            res.send(rows); 
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.delete('/categories/delete', (req, res, next) => {
    let parentCategoryIds = JSON.parse(req.body.parentCategoryIds);
    let subCategoryIds = JSON.parse(req.body.subCategoryIds);

    category.remove(subCategoryIds)
        .then(() => {
            category.remove(parentCategoryIds)
                .then(() => {
                    res.status(200).send({ success: true });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send({ error: err });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: err });
        });
});

// handle add category
router.post('/categories', function (req, res, next) {
    var newCategory = {
        name: req.body.name,
        parentID: req.body.parentID === '' ? null : parseInt(req.body.parentID)
        // parentID: parseInt(req.body.parentID) //TODO: set the <option value="id">  this id is the category id.
    };
    
    var promise = category.add(newCategory);

    promise
        .then(insertedID => {
            res.status(200).send({ insertedID: insertedID });
            //res.redirect('/admin/categories');
            // TODO: should pop-up a toast to notify success or not
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

// handle update category
router.put('/categories/update', (req, res, next) => {
    const name = req.body.name;
    const id = parseInt(req.body.id);
    const parentID = parseInt(req.body.parentID) || null;
    const row = { id: id, name: name, parentID: parentID };
    let promise = category.update(row);

    promise
        .then(() => {
            res.status(200).send({ success: true });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: err });
        });
});


// TODO: implement the 'path' below so when the user access localhost:3000/admin/'path', 
// the web server return the correct html
// Feel free to modify the ejs file content, ejs file name (must inside the views)

// get('/tags')
// get('/posts')
// get('/users') may be later, didn't have User table yet.

module.exports = router;