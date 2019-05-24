var express = require('express');
var router = express.Router();
var hbscontent = require('../app');

router.post('/', (req, res) => {
    hbscontent.isLogin = false;
    hbscontent.Username = '';
    hbscontent.isMainNavigationBar = true;
    
    if(hbscontent.isAdmin) hbscontent.isAdmin = false;
    if(hbscontent.isEditor) hbscontent.isEditor = false;
    if(hbscontent.isWriter) hbscontent.isWriter = false;
    if(hbscontent.isSubcriber) hbscontent.isSubcriber = false;

    var url = hbscontent.currentPage;
    if(url.includes('admin') || url.includes('editor') || url.includes('writer') || url.includes('subcriber')) {
        res.redirect(req.protocol + '://' + req.get('host'));
    }
    else{
        res.redirect(url);
    }
});

module.exports = router;