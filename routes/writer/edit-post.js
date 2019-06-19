var express = require('express');
var Multer = require('multer');
var router = express.Router();
var tag = require('../../models/admin/tags');
var post = require('../../models/admin/posts');
var articleModel = require('../../models/articles');
var categoryModel = require('../../models/categories');
var article_tag = require('../../models/article_tag');
var upload = require('../../utils/upload');
var tagModel = require('./../../models/admin/tags');
var articleTagModel = require('./../../models/article_tag');

  
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});
  

// All path has prefix with '/admin/users'

router.get('/:title', (req, res, next) => {
    // render file path auto prefix with /views/
    // override default 'main' layout, use 'manage' layout
    res.render('writer/edit-post', { layout: 'layouts/manage' });
});

router.get('/:title/load', (req, res, next) => {
    const title = req.params.title.replace(/-/g,' ');
    const writerID = req.session.passport.user.id;
    let article;
    let parentCategories;
    let categories;

    console.log(title);

    Promise.all([
        articleModel.searchDraftByTitle(writerID, title),
        categoryModel.loadParent(),
    ])
        .then(([art, parentCate]) => {
            article = art;
            parentCategories = parentCate;
            return categoryModel.loadChild(article.category.parent.id);
        })
        .then(cat => {
            categories = cat;
            console.log(cat);
            res.status(200).send({ article: article, parentCategories: parentCategories, categories: categories });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/category/:parentID', (req, res, next) => {
    const parentID = parseInt(req.params.parentID);

    categoryModel.loadChild(parentID)
        .then(rows => {
            console.log(rows);
            res.status(200).send(rows);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('error');
        });
});

router.post('/', multer.single('thumbnail'), (req, res, next) => {
    console.log(req);
    const file = req.file;
    let coverImageURL;
    console.log(req.body);
    let originalTags;
    let newTags;
    let deleteTags;
    let tags = JSON.parse(req.body.tags);
    let article;
    const artID = parseInt(req.body.id);

    articleModel.getStatusIdById(artID)
        .then(statusID => {
            if (file) {
                upload.uploadSingleThumbnail(file)
                    .then(url => {
                        coverImageURL = url;
        
                        article = {
                            id: parseInt(req.body.id),
                            title: req.body.title,
                            summary: req.body.summary,
                            content: req.body.content,
                            categoryID: req.body.subCategory,
                            coverImageURL: coverImageURL,
                            statusID: statusID,
                            writerID: req.session.passport.user.id
                        };
                        return articleTagModel.getTagIDByArticleID(article.id);
                    })
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
                            ...deleteTags.map(id => articleTagModel.remove(artID, id)),
                            articleModel.update(article)
                        ]);
                    })
                    .then(params => {
                        if (newTags.length > 0) {
                            let insertTagsID = params.slice(0, newTags.length);
                            return Promise.all(
                                insertTagsID.map(tagID => articleTagModel.insertSingleEntity({ tagID: tagID, articleID: artID }))
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
                        res.status(400).send('Lỗi, không thể đăng bài viết');
                    });
            } else {
                article = {
                    id: parseInt(req.body.id),
                    title: req.body.title,
                    summary: req.body.summary,
                    content: req.body.content,
                    categoryID: req.body.subCategory,
                    coverImageURL: coverImageURL,
                    statusID: statusID,
                    writerID: req.session.passport.user.id
                };
                articleTagModel.getTagIDByArticleID(article.id)
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
                            ...deleteTags.map(id => articleTagModel.remove(artID, id)),
                            articleModel.update(article)
                        ]);
                    })
                    .then(params => {
                        if (newTags.length > 0) {
                            let insertTagsID = params.slice(0, newTags.length);
                            return Promise.all(
                                insertTagsID.map(tagID => articleTagModel.insertSingleEntity({ tagID: tagID, articleID: artID }))
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
                        res.status(400).send('Lỗi, không thể đăng bài viết');
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/category', (req, res, next) => {
    console.log(req.body);
    let promise = categoryModel.loadParent();

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
    let promise = categoryModel.loadChild(parentCategoryID);

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