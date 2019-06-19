const express = require('express');
const router = express.Router();
const articleModel = require('./../../models/articles');
const categoryModel = require('./../../models/categories');
const moment = require('moment');
const tagModel = require('./../../models/admin/tags');
const articleTagModel = require('./../../models/article_tag');
const linkHelper = require('../../utils/linkHelper');


const sqlDateFormat = 'YYYY/MM/DD';
const ARTICLE_STATUS = {
    published : {
        label: 'đã xuất bản',
        id: 2
    },
    rejected : {
        label: 'bị từ chối',
        id: 3
    },
    pending_approval: {
        label: 'đang chờ duyệt',
        id: 4
    },
    pending_publish: {
        label: 'đã được duyệt & chờ xuất bản',
        id: 1
    }
};

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
    const host = req.headers['host'];

    articleModel.getDraftsByEditorID(req.session.passport.user.id, limit, offset, search, sort, order)
        .then(([total, rows]) => {
            rows.forEach(row => {
                row.href = host + '/draft' + linkHelper.concatToLink([row.title]);
            });
            
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
            
            return Promise.all([
                ...newTags.map(tagName => tagModel.insertTagNameifNotExists(tagName)),
                ...deleteTags.map(id => articleTagModel.remove(parseInt(req.body.draftID), id)),
                articleModel.update(draft)
            ]);
        })
        .then((params) => {
            
            if (newTags.length > 0) {
                let insertTagsID = params.slice(0, newTags.length);
                return Promise.all(
                    insertTagsID.map(tagID => articleTagModel.insertSingleEntity({ tagID: tagID, articleID: parseInt(req.body.draftID) }))
                );
            }
            else {
                console.log(true);
                return Promise.all([true]);
            }
        })
        .then(([rows]) => {
            res.status(200).send('success');
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/reject', (req, res, next) => {
    const id = parseInt(req.body.articleID);
    const reason = req.body.reason;
    const article = {
        id: id,
        statusID: ARTICLE_STATUS.rejected.id,
        rejectReason: reason
    };

    articleModel.update(article)
        .then(() => {
            res.status(200).send('success');
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('error');
        });
});


module.exports = router;