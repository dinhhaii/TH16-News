var express = require('express');
var router = express.Router();
var hbscontent = require('../app');

//Trang chủ
router.get('/', (req, res) => {
    hbscontent.title = 'VIZEW | Trang chủ';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('index', hbscontent);
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