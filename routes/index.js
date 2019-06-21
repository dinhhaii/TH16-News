var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var commentModel = require('../models/comment.model');
var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var tagModel = require('../models/tag.model');
var userModel = require('../models/user.model');
//Trang chủ
router.get('/', (req, res, next) => {
    hbscontent.title = 'VIZEW | Trang chủ';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    Promise.all([
        postModel.latestpost(10),
        postModel.descendingviews(10),
        postModel.descendingviewsByWeek(3),
        postModel.latestpostByCat(),
        commentModel.amountComment(),
        postModel.latestpost(1),
        postModel.latestpost(5)
    ]).then(([latestposts, trendingposts, featuredpostsbyweek, latestpostByCat, listviewscomment, newpost, postsidebar]) => {
        //Latest post
        latestposts.forEach(element => {
            categoryModel.single(element.idcategory)
            .then(catrows => {
                element['viewscomment'] = 0;
                element['namecategory'] = catrows[0].name; 
                listviewscomment.forEach(findIdProduct => {
                    if (findIdProduct.idproduct == element.id)
                    {
                        element.viewscomment = findIdProduct.amount;
                    }
                                
                })    
            })
            .catch(next);
        })
        hbscontent['latestposts'] = latestposts;

        //10 Trending post
        trendingposts.forEach(element => {
            categoryModel.single(element.idcategory)
            .then(catrows => {
                element['viewscomment'] = 0;
                element['namecategory'] = catrows[0].name;
                listviewscomment.forEach(findIdProduct => {
                    if (findIdProduct.idproduct == element.id)
                    {
                        element.viewscomment = findIdProduct.amount;
                    }
                    
                    var startDate = new Date(element.publishdate);
                    element.publishdate = (("0" + startDate.getDate()).slice(-2)) + "/" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "/" + (startDate.getFullYear()) + " " + (("0" + startDate.getHours()).slice(-2)) + ":" + (("0" + startDate.getMinutes()).slice(-2));
                })    
            })
            .catch(next);
        });
        trendingposts[0]['isfirsttrendingpost'] = true;
        hbscontent['trendingposts'] = trendingposts;

        //3 Featured Post By Week
        featuredpostsbyweek.forEach(element => {
            categoryModel.single(element.idcategory)
            .then(catrows => {
                element['viewscomment'] = 0;
                element['namecategory'] = catrows[0].name;
                listviewscomment.forEach(findIdProduct => {
                    if (findIdProduct.idproduct == element.id)
                    {
                        element.viewscomment = findIdProduct.amount;
                    }
                    
                })    
            })
            .catch(next);
        });
        hbscontent['featuredposts'] = featuredpostsbyweek;

        //New Post
        var entity = newpost[0];
        categoryModel.single(entity.idcategory)
        .then(catrows => {
            entity['viewscomment'] = 0;
            entity['namecategory'] = catrows[0].name;
            listviewscomment.forEach(findIdProduct => {
                if (findIdProduct.idproduct == entity.id)
                {
                    entity['viewscomment'] = findIdProduct.amount;
                }
                
            })    
        })
        .catch(next);
        hbscontent['newpost'] = entity;

        //Post Side Bar
        postsidebar.splice(0, 1);
        postsidebar.forEach(element => {
            element['viewscomment'] = 0;
            listviewscomment.forEach(findIdProduct => {
                if (findIdProduct.idproduct == element.id)
                {
                    element['viewscomment'] = findIdProduct.amount;
                }  
            })
        })
        hbscontent['postsidebar'] = postsidebar;

        //Latest Post by Category
        latestpostByCat.forEach(element => {
            userModel.single(element.idwriter)
            .then(user => {
                element['namewriter'] = user[0].name;
            })
            .catch(next);
            categoryModel.single(element.idcategory)
            .then(catrows => {
                element['viewscomment'] = 0;
                element['namecategory'] = catrows[0].name;
                var startDate = new Date(element.publishdate);
                element.publishdate = (("0" + startDate.getDate()).slice(-2)) + "/" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "/" + (startDate.getFullYear()) + " " + (("0" + startDate.getHours()).slice(-2)) + ":" + (("0" + startDate.getMinutes()).slice(-2));
                listviewscomment.forEach(findIdProduct => {
                    if (findIdProduct.idproduct == element.id)
                    {
                        element.viewscomment = findIdProduct.amount;
                    }
                })
                
            })
            .catch(next);
            
        })
        hbscontent['latestpostByCat'] = latestpostByCat;
        
        res.render('index', hbscontent);

    }).catch(next);

});

//Liên lạc
router.get('/contact', (req, res) => {

    hbscontent.title= 'Liên lạc',
    hbscontent.breadcrumbitemactive= 'Liên lạc'
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('contact',hbscontent);
});

//Quên mật khẩu
router.get('/forgetpassword', (req, res) => {

    hbscontent.title= 'Quên mật khẩu';
    hbscontent.breadcrumbitemactive = 'Quên mật khẩu';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('forgetpassword',hbscontent);
});

//Xác nhận email (quên mật khẩu)
router.get('/confirmemail', (req, res) => {

    hbscontent.title = 'Xác nhận email';
    hbscontent.breadcrumbiteminactive = '<li class="breadcrumb-item" aria-current="page"><a href="/forgetpassword">Quên mật khẩu</a></li>';
    hbscontent.breadcrumbitemactive = 'Xác nhận email';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('confirmemail', hbscontent);
});

//Đổi mật khẩu
router.get('/changepassword', (req, res) => {
    
    hbscontent.title = 'Đổi mật khẩu';
    hbscontent.breadcrumbiteminactive = '<li class="breadcrumb-item" aria-current="page"><a href="/forgetpassword">Quên mật khẩu</a></li><li class="breadcrumb-item" aria-current="page"><a href="/confirmemail">Xác nhận Email</a></li>';
    hbscontent.breadcrumbitemactive = 'Đổi mật khẩu';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    
    res.render('changepassword', hbscontent);
});


module.exports = router;