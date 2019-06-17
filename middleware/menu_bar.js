var express = require('express');
var router = express.Router();
var category = require('../models/categories');
var user_role = require('../models/user_role');

function setLoginInfo(req, res, next) {
    let user;
    if (typeof req.session.passport !== 'undefined')
        user = req.session.passport.user;

    if (typeof user !== 'undefined' && typeof user.roleID !== 'undefined') {
        res.locals.login = true;
        user_role.getName(user.roleID)
            .then(roleName => {

                res.locals.user = {
                    role: roleName,
                    avatar: req.session.passport.user.avatar,
                    name: req.session.passport.user.name
                };
                next();
            })
            .catch(err => {
                console.log(err);
                next();
            });
    } else {
        res.locals.login = false;
        next();
    }
}

router.use(setLoginInfo, (req, res, next) => {
    var url = req.url;
    if (url.match('/admin/*') ||
        url.match('/editor/*') ||
        url.match('/writer/*')) {
        next();
        return;
    }
    
    category.loadMainIncludeChild()
        .then(rows => {
            //Đối tượng res.locals lưu giữ các biến local trong 1 request,
            //truy xuất trực tiếp được từ view bất kỳ
            res.locals.categories = rows;
            res.locals.isHome = false;
            res.locals.category = undefined;

            next();     // Chuyển tiếp đến router thật sự (nếu có) hoặc chuyển đến router xử lý lỗi
        })
        .catch(err => {
            // fix isHome is not defined
            if (err) throw err;
        });
});

module.exports = router;