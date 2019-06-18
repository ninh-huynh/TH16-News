var express = require('express');
var router = express.Router();
var post = require('../../models/admin/posts');

// All path has prefix with '/admin/users'

router.get('/', (req, res, next) => {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('admin/posts', { layout: 'layouts/manage' });
});

router.get('/load', (req, res, next) => {
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sort = req.query.sort;
    let order = req.query.order;
    let search = req.query.search;

    let promise = post.load(limit, offset, search, sort, order);

    promise
        .then(([total, rows]) => {
            console.log({ total: total, rows: rows });
            res.send({ total: total, rows: rows });
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});


router.delete('/', (req, res, next) => {
    let ids = JSON.parse(req.body.ids);
    let promise = post.remove(ids);

    promise
        .then(res => {
            res.status(200).send();
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.put('/update-status', (req, res, next) => {
    let id = parseInt(req.body.id);
    let newStatus = req.body.status;
    let promise = post.updateStatus(id, newStatus);

    promise
        .then(res => {
            res.status(200).send('success');
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});


module.exports = router;