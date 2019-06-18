const express = require('express');
const router = express.Router();
const articleModel = require('./../../models/articles');
const categoryModel = require('./../../models/categories');
const moment = require('moment');
const tagModel = require('./../../models/admin/tags');
const articleTagModel = require('./../../models/article_tag');


const sqlDateFormat = 'YYYY/MM/DD';


router.get('/', (req, res, next) => {
    res.render('editor/approve-draft', { layout: 'layouts/manage' });
});

router.get('/load', (req, res, next) => {
    console.log(req.query);
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    articleModel.getDraftsByEditorID(req.session.passport.user.id, limit, offset, search, sort, order)
        .then(([total, rows]) => {
            res.status(200).send({ total: total, rows: rows });
        })
        .catch(err => {
            console.log(err);
            res.status(400).end('');
        });
});

router.get('/category/parent', (req, res ,next) => {
    categoryModel.loadParent()
        .then(rows => {
            res.send(rows);
        })
        .catch(err => {
            console.log(err);
            res.status(400).end('');
        });
});

router.get('/:draftID', (req, res, next) => {
    const draftID = parseInt(req.params.draftID);

    articleModel.getDraftInfo(draftID)
        .then(([categories, tags]) => {
            res.send({ categories: categories, tags: tags });
        })
        .catch(err => {
            console.log(err);
            res.status(400).end('');
        });
});

router.post('/approve', (req, res, next) => {
    console.log(req.body);
    const draft = {
        id: parseInt(req.body.draftID),
        categoryID: parseInt(req.body.categoryID),
        publicationDate: moment(new Date(req.body.publicationDate)).format(sqlDateFormat),
        statusID: 1
    };

    const tags = JSON.parse(req.body.tags);
    let originalTags;
    let newTags;
    let deleteTags;

    articleTagModel.getTagIDByArticleID(draft.id)
        .then(rows => {
            originalTags = rows;
            newTags = tags.reduce((arr, tagName) => {
                if (originalTags.every(value => value.name.toLowerCase() !== tagName.toLowerCase()))
                    arr.push(tagName);

                return arr;
            }, []);

            deleteTags = originalTags.reduce((arr, tag) => {
                if (tags.every(tagName => tagName.toLowerCase() !== tag.name.toLowerCase()))
                    arr.push(tag.id);

                return arr;
            }, []);
            console.log(draft);
            Promise.all([
                ...newTags.map(tagName => tagModel.insertTagNameifNotExists(tagName)),
                ...deleteTags.map(id => tagModel.remove([id])),
                articleModel.update(draft)
            ])
                .then(([tagsID]) => {
                    console.log([tagsID, draft]);
                    tagsID = [].concat(tagsID);
                    Promise.all(
                        tagsID.map(tagID => articleTagModel.insertSingleEntity({ tagID: tagID, articleID: parseInt(req.body.draftID) }))
                    )
                        .then(([rows]) => {
                            res.status(200).send('success');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err);
                });


            console.log([newTags, deleteTags]);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.get('/test', (req, res, next) => {

});


module.exports = router;