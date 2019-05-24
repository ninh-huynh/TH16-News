var express = require('express');
var router = express.Router();
var category = require('../models/category');

router.use((req, res, next) => {
    category.loadMainIncludeChild()
        .then(rows => {
            //Đối tượng res.locals lưu giữ các biến local trong 1 request,
            //truy xuất trực tiếp được từ view bất kỳ
            res.locals.categories = rows;
            next();     // Chuyển tiếp đến router thật sự (nếu có) hoặc chuyển đến router xử lý lỗi
        })
        .catch(next);
});

module.exports = router;