var express = require('express');
var router = express.Router();
var articleModel = require('../models/articles');
var commentModel = require('../models/comments');
var articleViewsModel = require('../models/article_views');
var userRoleModel = require('../models/user_role');
var moment = require('moment');


router.get('/:title', (req, res, next) => {
    var userEntity = req.user;
    var title = req.params.title;
    var articleEntity;
    var today = moment().format('YYYY-MM-DD');
    var isAbleToView;
    var isSubscriberCanViewPremium = false;     // check the subscriber login and currentDate <= expiry date
    var subscriberName = null;

    title = title.replace(/-/g, ' ');

    userRoleModel.getId('Độc giả')
        .then(roleID => {


            if (userEntity !== undefined && userEntity.roleID === roleID) {

                if (userEntity.roleID === roleID) {
                    subscriberName = userEntity.name;
                }

                if (moment().isBefore(userEntity.expiryDate))
                    isSubscriberCanViewPremium = true;
            }

            return articleModel.searchByTitle(title);
        })
        .then(article => {
            articleEntity = article;
            var pLoadBySameCategory = articleModel.loadBySameCategory(articleEntity);
            var pIncreaseViews = articleViewsModel.increaseView(article, today);
            return Promise.all([pLoadBySameCategory, pIncreaseViews]);
        })
        .then(([rows, totalRowEffected]) => {
            isAbleToView = !articleEntity.isPremium || isSubscriberCanViewPremium;

            var obj = {
                article: articleEntity,
                sameCategoryArticle: rows,
                isAbleToView,
                subscriberName
            };
            res.render('post', obj);
        })
        .catch(next);
});

router.post('/:title/comment', (req, res, next) => {
    var title = req.body.articleTitle;
    title = title.replace(/-/g, ' ');

    articleModel.searchByTitle(title)
        .then(article => {
            delete req.body.articleTitle;
            req.body.articleID = article.id;
            return commentModel.add(req.body);
        })
        .then(insertedRow => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;