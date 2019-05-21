var express = require('express');
var router = express.Router();
var category = require('../models/categories');

router.use((req, res, next) => {

    // Lấy toàn bộ các chuyên mục con và chèn vào chuyên mục cha (dưới dạng mảng)
    category.loadMain()
        .then(rows => {
            var promises = [];  // Chứa các promise sẽ được gọi            
            rows.forEach((row, index) => {
                promises[index] = category.loadChild(row.id);
            });
            return { rows, promises };
        })
        .then((obj) => {

            // Nhận kết quả từ promise trên
            var promises = obj.promises;
            var rows = obj.rows;
            
            // Bắt đầu thực hiện lệnh bất đồng bộ,
            // chờ khi tất cả các promise đã thực hiện xong(hoặc có 1 promise lỗi)
            Promise.all(promises)
                .then(childArr => {
                    rows.forEach((row, index) => {
                        row.child = childArr[index];
                    });
                    
                    //Đối tượng res.locals lưu giữ các biến local trong 1 request,
                    //truy xuất trực tiếp được từ view bất kỳ
                    res.locals.categories = rows;   
                    next();     // Chuyển tiếp đến router thật sự (nếu có) hoặc chuyển đến router xử lý lỗi
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;