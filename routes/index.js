var express = require('express');
var router = express.Router();
var hbscontent = require('../app');

var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var tagModel = require('../models/tag.model');
//Trang chủ
router.get('/', (req, res, next) => {
    hbscontent.title = 'VIZEW | Trang chủ';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    //Latest post
    postModel.latestpost(10)
    .then(rows => {
        rows.forEach(element => {
            categoryModel.single(element.idcategory).then(catrows => {
                element['namecategory'] = catrows[0].name;
                var dt = new Date(Date(element.createddate));
                element['createddate'] = (("0"+dt.getDate()).slice(-2)) +"/"+ (("0"+(dt.getMonth()+1)).slice(-2)) +"/"+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2));
            }).catch(next);
        })
        hbscontent['latestposts'] = rows;
    }).catch(next);

    //10 Trending post
    postModel.descendingviews(10)
    .then(rows => {
        rows.forEach(element => {
            element['isfirsttrendingpost'] = false;
            categoryModel.single(element.idcategory).then(catrows => {
                var dt = new Date(Date(element.createddate));
                element['createddate'] = (("0"+dt.getDate()).slice(-2)) +"/"+ (("0"+(dt.getMonth()+1)).slice(-2)) +"/"+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2));
                element['namecategory'] = catrows[0].name;                
            }).catch(next);
        });
        
        rows[0]['isfirsttrendingpost'] = true;
        hbscontent['trendingposts'] = rows;
        console.log(rows);
        res.render('index', hbscontent);
    }).catch(next);

    

});

//Đăng kí
router.get('/signup', (req, res) => {

    hbscontent.title = 'Đăng kí';
    hbscontent.breadcrumbitemactive = 'Đăng kí';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('signup', hbscontent);
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