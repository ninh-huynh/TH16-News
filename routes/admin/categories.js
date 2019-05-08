var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    
    // auto prefix with /views/
    res.render('admin/manage-category');
});

module.exports = router;