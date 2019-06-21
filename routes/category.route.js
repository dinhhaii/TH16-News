var express = require('express');
var router = express.Router();
var commentModel = require('../models/comment.model');

var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');


router.get('/:id/posts', (req, res, next) => {
    var id = req.params.id;
    //Lấy name của category để làm title

    categoryModel.single(id).then(catrows => {
        if (catrows.length > 0) {
            hbscontent.title = catrows[0].name;         
        }
    }).catch(next);

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 3;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postModel.pageByCat(id, limit, offset),
        postModel.countByCat(id),
        commentModel.amountComment()
    ]).then(([rows, count_rows, listviewscomment]) => {   
        
        //Lấy tên writer và ngày khởi tạo bài viết
        rows.forEach(element => {
            userModel.single(element.idwriter).then(userrows => {   
                element['namewriter'] = userrows[0].name;
            })    
            var startDate = new Date(element.publishdate);
            element.publishdate = (("0" + startDate.getDate()).slice(-2)) + "/" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "/" + (startDate.getFullYear()) + " " + (("0" + startDate.getHours()).slice(-2)) + ":" + (("0" + startDate.getMinutes()).slice(-2));
        });

        var total = count_rows[0].total;
        var npages = Math.floor(total / limit);

        if((total % limit > 0) && (total > limit)) npages++;

        var pages = [];
        for(i = 1; i <= npages; i++){
            var obj = {value: i, active: i === +page};
            pages.push(obj);
        }

        rows.forEach(element => {
            element['viewscomment'] = 0;
            listviewscomment.forEach(findIdProduct => {
                if (findIdProduct.idproduct == element.id)
                    element['viewscomment'] = findIdProduct.amount;
            })
        })

        
        hbscontent['posts'] = rows;
        hbscontent['idcategory'] = id;
        hbscontent.isMainNavigationBar = true;
        hbscontent.breadcrumbitemactive = hbscontent.title;
        hbscontent['pages'] = pages;
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        res.render('categorylist', hbscontent);
    })
    .catch(next);
});

module.exports = router;