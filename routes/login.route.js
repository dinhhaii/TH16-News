var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var hbscontent = require('../app');
var passport = require('passport');

router.get('/', (req, res) => {
    hbscontent.title = 'Đăng nhập',
    hbscontent.breadcrumbitemactive = 'Đăng nhập';
    hbscontent.isMainNavigationBar = true;

    res.render('login', hbscontent);
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return next(err);
        }
        if(!user){            
            // Object.assign(hbscontent, {err_message: info.message});
            hbscontent['err_message'] = info.message;
            return res.render('login', hbscontent);
        }

        console.log(req.query.retUrl);
        var retUrl = req.query.retUrl || '/';
        req.logIn(user , err => {
            if(err){
                return next(err);
            }
            switch (user.position) {
                case 'admin': hbscontent.isAdmin = true; hbscontent.isEditor = false; hbscontent.isWriter = false; hbscontent.isSubcriber = false; break;
                case 'editor': hbscontent.isEditor = true; hbscontent.isAdmin = false; hbscontent.isWriter = false; hbscontent.isSubcriber = false; break;
                case 'writer': hbscontent.isWriter = true; hbscontent.isEditor = false; hbscontent.isAdmin = false; hbscontent.isSubcriber = false; break;
                case 'subcriber': hbscontent.isSubcriber = true; hbscontent.isWriter = false; hbscontent.isEditor = false; hbscontent.isAdmin = false; break;
                default: break;
            }
            hbscontent.Username = user.name;
            hbscontent.isLogin = true;
            hbscontent.currentuserid = user.id;
            return res.redirect(retUrl);
        });
    })(req, res, next);
})


// var iserror = false;

// router.post('/', (req, res, next) => {
//     var entity = req.body;

//     userModel.findUsername(entity.username)
//     .then(rows => {
//         if(rows.length > 0){
//             if(entity.password == rows[0].password){
//                 switch(rows[0].position){
//                     case 'admin': hbscontent.isAdmin = true; hbscontent.isEditor = false; hbscontent.isWriter = false; hbscontent.isSubcriber = false; break;
//                     case 'editor': hbscontent.isEditor = true; hbscontent.isAdmin = false; hbscontent.isWriter = false; hbscontent.isSubcriber = false; break;
//                     case 'writer': hbscontent.isWriter = true; hbscontent.isEditor = false; hbscontent.isAdmin = false; hbscontent.isSubcriber = false;break;
//                     case 'subcriber': hbscontent.isSubcriber = true; hbscontent.isWriter = false; hbscontent.isEditor = false; hbscontent.isAdmin = false; break;
//                     default: break;
//                 }
//                 hbscontent.Username = rows[0].name;
//                 hbscontent.isLogin = true;
//                 hbscontent.currentuserid = rows[0].id;
//                 isloginerror = false;            
//             }
//             else{
//                 isloginerror = true;                
//             }
//         }
//         else{
//             isloginerror = true; 
//         }
//     })
//     .catch(next)
//     .finally(() => {
//         if(isloginerror){
//             res.render('login', {
//                 isLoginError: true
//             });
//         }else{
//             hbscontent['isLoginError'] = false;
//             res.redirect(hbscontent.currentPage);
//         }
//     })
// });

module.exports = router;