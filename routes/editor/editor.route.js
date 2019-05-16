var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');

router.get('/approvepost', (req, res) => {
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    
    res.render('editor/editor-approvepost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('editor/editor-editprofile');
});

module.exports = router;