var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');

router.get('/', (req, res) => {
    hbscontent.title = 'Editor';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    res.redirect('/editor/approvepost');
});

router.get('/approvepost', (req, res) => {    
    
    res.render('editor/editor-approvepost', hbscontent);
});

router.get('/approvedpost', (req, res) => {
    
    res.render('editor/editor-approvedpost', hbscontent);
});

router.get('/rejectedpost', (req, res) => {

    res.render('editor/editor-rejectedpost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('editor/editor-editprofile');
});

module.exports = router;