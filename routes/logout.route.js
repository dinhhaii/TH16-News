var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var auth = require('../middlewares/auth');

router.post('/', auth, (req, res) => {
    hbscontent.isLogin = false;
    hbscontent.Username = '';
    hbscontent.isMainNavigationBar = true;
    
    req.logOut();

    if(hbscontent.isAdmin) hbscontent.isAdmin = false;
    if(hbscontent.isEditor) hbscontent.isEditor = false;
    if(hbscontent.isWriter) hbscontent.isWriter = false;
    if(hbscontent.isSubcriber) hbscontent.isSubcriber = false;

    var url = hbscontent.currentPage;
    res.redirect(url);
});

module.exports = router;