var express = require('express');
var router = express.Router();
var category = require('../../models/categories');           // import category model
var userModel = require('../../models/users');
var userRoleModel = require('../../models/user_role');
var moment = require('moment');

// All path has prefix with '/admin/users'

router.get('/', (req, res, next) => {
    res.render('admin/users', { layout: 'layouts/manage' });
});

router.get('/load', (req, res, next) => {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    var filter = req.query.filter;
    var role;
    if (filter !== undefined) { role = filter.role; }
    var search = req.query.search;
    var order = req.query.order;
    var sort = req.query.sort;

    Promise.all([userModel.countTotal(), userModel.load(limit, offset, sort, order)])
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

router.post('/add', (req, res, next) => {
    var newUser = req.body;

    var dob = moment(newUser.dayOfBirth, 'DD/MM/YYYY');
    newUser.dayOfBirth = dob.format('YYYY-MM-DD');
    var defaultPassword = dob.format('DDMMYYYY');

    userModel.add(newUser)
        .then(affectedRows => {

            res.render('_widget/add-success-alert', { layout: 'layouts/empty', });
        }).catch(err => {

            res.render('_widget/error-alert-admin', { layout: 'layouts/empty', err });
        });
});

router.delete('/delete', (req, res, next) => {
    var userIDs = JSON.parse(req.body.ids);

    userModel.removeAll(userIDs)
        .then(affectedRows => {

            res.render('_widget/delete-success-alert', { layout: 'layouts/empty', totalRow: affectedRows });
        })
        .catch(err => {

            res.render('_widget/error-alert-admin', { layout: 'layouts/empty', err });
        });
});

router.post('/update', (req, res, next) => {
    var newUser = req.body;
    userModel.update(newUser)
        .then(affectedRows => {

            res.render('_widget/update-success-alert', { layout: 'layouts/empty', });
        }).catch(err => {

            res.render('_widget/error-alert-admin', { layout: 'layouts/empty', err });
        });
});

router.get('/update/:id', (req, res, next) => {

    var id = parseInt(req.params.id);
    if (isNaN(id)) {
        next();     // 404 not found
        return;
    }

    var pLoadUser = userModel.loadById(id);
    var pLoadUserRoles = userRoleModel.load();
    var pLoadCategories = category.loadAll();

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
            res.render('_widget/error-alert-admin', { layout: 'layouts/empty', err1 });
        });
});

router.post('/renew', (req, res, next) => {
    var userEntity = req.body;

    var newExpiryDate = moment(userEntity.expiryDate).add(7, 'days').format('YYYY-MM-DD');
    userEntity.expiryDate = newExpiryDate;
    
    userModel.update(userEntity)
        .then(affectedRows => {

            res.render('_widget/update-success-alert', { layout: 'layouts/empty', });
        }).catch(err => {
            console.log(err);

            res.render('_widget/error-alert-admin', { layout: 'layouts/empty', err });
        });
});

module.exports = router;