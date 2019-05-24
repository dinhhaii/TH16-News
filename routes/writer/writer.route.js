var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')


router.get('/', (req, res) => {
    hbscontent.title = 'Writer';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isWriter = true;
    res.redirect('/writer/writepost');
});

router.get('/writepost', (req, res) => {

    res.render('writer/writer-writepost', hbscontent);
});

router.get('/writepost', (req, res) => {

    res.render('writer/writer-writepost', hbscontent);
});

router.get('/approvedpost', (req, res) => {

    res.render('writer/writer-approvedpost', hbscontent);
});

router.get('/unapprovedpost', (req, res) => {

    res.render('writer/writer-unapprovedpost', hbscontent);
});

router.get('/rejectedpost', (req, res) => {

    res.render('writer/writer-rejectedpost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('writer/writer-editprofile');
});

module.exports = router;