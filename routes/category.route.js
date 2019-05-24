var express = require('express');
var router = express.Router();

var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');


router.get('/:id/posts', (req, res, next) => {
    var id = req.params.id;
    //Lấy name của category để làm title
    var title = '';
    categoryModel.single(id).then(catrows => {
        if (catrows.length > 0) {
            title = catrows[0].name;         
        }
    }).catch(next);

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 5;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pageByCat(id, limit, offset),
        postModel.countByCat(id)
    ]).then(([rows, count_rows]) => {        
        var total = count_rows[0].total;
        var npages = Math.floor(total / limit);
        if(total % limit > 0) npages++;

        var pages = [];
        for(i = 1; i <= npages; i++){
            var obj = {value: i, active: i === +page};
            pages.push(obj);
        }

        hbscontent['posts'] = rows;
        hbscontent.isMainNavigationBar = true;
        hbscontent.title = title;
        hbscontent.breadcrumbitemactive = title;
        hbscontent['pages'] = pages;

        res.render('categorylist', hbscontent);
    })
    .catch(next);
});

module.exports = router;