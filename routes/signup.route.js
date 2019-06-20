var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var bcrypt = require('bcryptjs');
var userModel = require('../models/user.model');
//var moment = require('moment'); 

//Đăng kí
router.get('/', (req, res, next) => {

    hbscontent.title = 'Đăng kí';
    hbscontent.breadcrumbitemactive = 'Đăng kí';
    hbscontent.isMainNavigationBar = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;

    res.render('signup', hbscontent);
});

router.post('/', (req, res, next) => {
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);

    var entity = req.body;
    entity['password'] = hash;
    entity['phone'] = 0;
    entity['createddate'] = new Date();
    entity['position'] = 'subcriber';
    delete entity['confirm'];
    delete entity['CaptchaInput'];
    console.log(entity);

    userModel.add(entity)
    .then(() => {
        res.redirect('/login');
    })
    .catch(next);
});

router.get('/is-available',(req, res, next) => {
    var username = req.query.username;
    console.log(username);
    userModel.singleByUserName(username)
    .then(rows => {
        if(rows.length > 0){
            return res.json(false);
        }
        return res.json(true);
    })
});

module.exports = router;