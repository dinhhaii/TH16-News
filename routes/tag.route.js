var express = require('express');
var router = express.Router();
var commentModel = require('../models/comment.model');
var userModel = require('../models/user.model');
var postTagModel = require('../models/post-tag.model');
var tagModel = require('../models/tag.model');
var hbscontent = require('../app');


router.get('/:id/posts', (req, res, next) => {
    var id = req.params.id; // idtag

    tagModel.single(id).then(tagrows => {
        if (tagrows.length > 0) {
            hbscontent.title = "#" + tagrows[0].name;         
        }
    }).catch(next);

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 3;
    var offset = (page - 1) * limit;
    
    Promise.all([
        postTagModel.pagePostByTag(id, limit, offset, "Đã duyệt"),
        postTagModel.countPostByTag(id),
        commentModel.amountComment()
    ]).then(([rows, count_rows, listviewscomment]) => {   
        console.log(rows);
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
        if(total % limit > 0) npages++;

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
        hbscontent.isMainNavigationBar = true;
        hbscontent.breadcrumb = '';
        hbscontent['pages'] = pages;
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        res.render('taglist', hbscontent);
    })
    .catch(next);
});

module.exports = router;