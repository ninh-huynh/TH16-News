var express = require('express');
var router = express.Router();
var tag = require('../../models/admin/tags');

// All path has prefix with '/admin/users'

router.get('/', (req, res, next) => {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('admin/tags', { layout: 'layouts/manage' });
});

router.get('/load', (req, res, next) => {
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let sort = req.query.sort;
    let order = req.query.order;
    let search = req.query.search;

    let promise = tag.load(limit, offset, search, sort, order);

    promise
        .then(([total, rows]) => {
            res.send({ total: total, rows: rows });
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.post('/', (req, res, next) => {
    let newTag = { name: req.body.name };
    let promise = tag.add(newTag);
    console.log(newTag);
    promise
        .then(insertedID => {
            console.log(insertedID);
            res.status(200).send({ insertedID: insertedID });
        })
        .catch(err => {
            console.log(err);
            res.end('');
        });
});

router.delete('/', (req, res, next) => {
    let ids = JSON.parse(req.body.ids);
    let promise = tag.remove(ids);

    promise
        .then(() => {
            res.status(200).send({ success: true });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: err });
        });
     
});

router.put('/', (req, res, next) => {
    let data = JSON.parse(req.body.data);
    let promise = tag.update(data);

    promise
        .then(() => {
            res.status(200).send({ success: true });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: err });
        });
});

router.get('/update/:id', (req, res, next) => {

});


module.exports = router;