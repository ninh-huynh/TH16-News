var express = require('express');
var router = express.Router();
var category = require('../models/categories');           // import category model
var userModel = require('../models/users');
var linkHelper = require('../utils/linkHelper');
var moment = require('moment');
var userRoleModel = require('../models/user_role');

// handle read category
router.get('/categories', function (req, res, next) {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('admin/categories', { layout: 'layouts/manage' });
});

router.get('/categories/load', (req, res, next) => {
    let promise;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    console.log(req.query);

    switch(req.query.load) {
        case 'all':
            if ('filter' in req.query) {
                promise = category.loadByParentID(parseInt(JSON.parse(req.query.filter).parentName), limit, offset);
            } else {
                promise = category.load(limit, offset);
            }


            promise
                .then(([total, rows]) => {
                    res.send({ total: total, rows: rows }); 
                })
                .catch(err => {
                    console.log(err);
                    res.end('');
                });
            break;

        case 'parent':
            promise = category.loadParent()
                .then((rows) => {
                    res.send(rows); 
                })
                .catch(err => {
                    console.log(err);
                    res.end('');
                });
            break;

        case 'parent-name':
            promise = category.loadParent()
                .then((rows) => {
                    var names = rows.reduce((names, parent) => Object.assign(names, { [parent.id]: parent.name }) ,{});
                    res.send(names); 
                })
                .catch(err => {
                    console.log(err);
                    res.end('');
                });
            break;

        case 'child':
            promise = category.loadChild(req.query.parentId)
                .then((rows) => {
                    res.send(rows); 
                })
                .catch(err => {
                    console.log(err);
                    res.end('');
                });
            break;
        default:
    }
});

router.delete('/categories/delete', (req, res, next) => {
    let ids = JSON.parse(req.body.ids);

    category.remove(ids)
        .then(() => {
            res.status(200).send({ success: true });
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
        parentID: req.body.parentID === '' ? null : parseInt(req.body.parentID),
        // parentID: parseInt(req.body.parentID) //TODO: set the <option value="id">  this id is the category id.
        path: linkHelper.concatToLink(['categories', req.body.name])
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
router.get('/users', (req, res, next) => {
    res.render('admin/users', { layout: 'layouts/manage' });
});

router.get('/users/load', (req, res, next) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    var filter = req.query.filter;
    var role;
    if (filter !== undefined) { role = filter.role; }
    var search = req.query.search;
    var order = req.query.order;
    var sort = req.query.sort;

    Promise.all([userModel.countTotal(), userModel.load(limit, offset)])
        .then(([total, rows]) => {
            var obj = {
                total,
                rows,
            };
            res.send(obj);
        })
        .catch((err1, err2) => {
            console.log(err1);
            console.log(err2);
        });
});

router.post('/users/add', (req, res, next) => {
    var newUser = req.body;

    var dob = moment(newUser.dayOfBirth, 'DD/MM/YYYY');
    newUser.dayOfBirth = dob.format('YYYY-MM-DD');
    var defaultPassword = dob.format('DDMMYYYY');

    userModel.add(newUser)
        .then(affectedRows => {

            res.render('_widget/add-success-alert', { layout: 'layouts/empty', });
        }).catch(err => {

            res.render('_widget/error-alert', { layout: 'layouts/empty', err });
        });
});

router.delete('/users/delete', (req, res, next) => {
    var userIDs = JSON.parse(req.body.ids);

    userModel.removeAll(userIDs)
        .then(affectedRows => {

            res.render('_widget/delete-success-alert', { layout: 'layouts/empty', totalRow: affectedRows });
        })
        .catch(err => {

            res.render('_widget/error-alert', { layout: 'layouts/empty', err });
        });
});

router.post('/users/update', (req, res, next) => {
    var newUser = req.body;
    userModel.update(newUser)
        .then(affectedRows => {

            res.render('_widget/update-success-alert', { layout: 'layouts/empty', });
        }).catch(err => {

            res.render('_widget/error-alert', { layout: 'layouts/empty', err });
        });
});

router.get('/users/update/:id', (req, res, next) => {
    
    var id = parseInt(req.params.id);
    if (isNaN(id)) {
        next();     // 404 not found
        return;
    }
    
    var pLoadUser = userModel.loadById(id);
    var pLoadUserRoles = userRoleModel.load();
    var pLoadCategories = category.load();

    Promise.all([pLoadUser, pLoadUserRoles, pLoadCategories])
        .then(([userEntity, userRoles, categories]) => {
            var obj = {
                layout: 'layouts/empty',
                user: userEntity,
                userRoles,
                categories,
            };
            res.render('_widget/update-user-form', obj);
        })
        .catch(([err1, err2]) => {
            res.render('_widget/error-alert', { layout: 'layouts/empty', err1 });
        });
});

module.exports = router;