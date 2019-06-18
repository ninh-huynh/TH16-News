var express = require('express');
var Multer = require('multer');
var router = express.Router();
var tag = require('../../models/admin/tags');
var post = require('../../models/admin/posts');
var article = require('../../models/articles');
var category = require('../../models/categories');
var article_tag = require('../../models/article_tag');
var upload = require('../../utils/upload');

  
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});
  

// All path has prefix with '/admin/users'

router.get('/', (req, res, next) => {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('writer/new-post', { layout: 'layouts/manage' });
});

router.post('/', multer.single('thumbnail'), (req, res, next) => {
    console.log(req);
    const file = req.file;
    let coverImageURL;
    console.log(req.body);
    upload.uploadSingleThumbnail(file)
        .then(url => {
            coverImageURL = url;

            const newArticle = {
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                categoryID: req.body.childCategory,
                coverImageURL: coverImageURL,
                statusID: 4,
                writerID: req.session.passport.user.id
            };
            
            const tags = JSON.parse(req.body.tags).map(tag => ({ name: tag }));

            Promise.all([
                article.add(newArticle),
                ...tags.map(newTag => tag.insertIfNotExists(newTag))
            ])
                .then(arr => {
                    let insertedArticleID = arr[0];
                    arr.shift();
                    let insertedTagsID =  arr.map(tagID => tagID);

                    Promise.all(insertedTagsID.map(tagID => article_tag.add({ articleID: insertedArticleID, tagID: tagID })))
                        .then(() => {
                            res.status(200).send('success');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send('Lỗi, không thể đăng bài viết');
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send('Lỗi, không thể đăng bài viết');
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('Lỗi, không thể đăng bài viết');
        });
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


module.exports = router;