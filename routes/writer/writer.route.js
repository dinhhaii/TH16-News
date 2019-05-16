var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')

router.get('/writepost', (req, res) => {

    hbscontent.isMainNavigationBar = false;
    hbscontent.isWriter = true;

    res.render('writer/writer-writepost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('writer/writer-editprofile');
});

module.exports = router;