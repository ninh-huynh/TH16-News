var express = require('express');
var router = express.Router();
var tag = require('../../models/admin/tags');
const articleModel = require('../../models/articles');
const moment = require('moment');
const linkHelper = require('./../../utils/linkHelper');
  
const sqlDateFormat = 'YYYY/MM/DD';

const ARTICLE_STATUS = {
    published : {
        label: 'đã xuất bản',
        id: 2
    },
    refused : {
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
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('writer/my-posts', { layout: 'layouts/manage' });
});

router.get('/load', (req, res, next) => {
    const writerID = parseInt(req.session.passport.user.id);
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const search = req.query.serach;
    const sort = req.query.sort;
    const order = req.query.order;
    const host = req.headers['host'];

    articleModel.getArticleByWriterID(writerID, limit, offset, search, sort, order)
        .then(([ total, rows ]) => {
            console.log(rows);
            rows.forEach(row => {
                if (row.publicationDate)
                    row.publicationDate = moment(row.publicationDate, sqlDateFormat).format('DD/MM/YYYY');

                switch(row.statusID) {
                    case ARTICLE_STATUS.published.id:
                        row.href = host + linkHelper.concatToLink([row.title]);
                        break;

                    case ARTICLE_STATUS.pending_approval.id:
                    case ARTICLE_STATUS.pending_publish.id:
                        row.href = host + '/draft' +linkHelper.concatToLink([row.title]);
                        break;
                    
                    case ARTICLE_STATUS.refused.id:
                        row.href = host + '/writer/edit' + linkHelper.concatToLink([row.title]);
                        break;
                    default:
                }
            });

            res.send({ total: total, rows: rows });
        })
        .catch(err => {
            console.log(err);
        });
});


module.exports = router;