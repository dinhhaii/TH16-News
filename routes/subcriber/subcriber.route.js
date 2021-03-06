var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');
var userModel = require('../..//models/user.model');
var authSubcriber = require('../../middlewares/auth-subcriber');
var vipsubcriberModel = require('../..//models/vipsubcriber.model');
var bcrypt = require('bcryptjs');

router.get('/', authSubcriber, (req, res) => {
    hbscontent.title = 'Đọc giả';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isSubcriber = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/subcriber');
});

router.get('/profile', authSubcriber, (req,res, next) => {
    hbscontent.title = "Thông tin cá nhân";
    hbscontent.isMainNavigationBar = false;
    userModel.single(hbscontent.currentuserid)
    .then(user => {
        vipsubcriberModel.single(user[0].id)
        .then(userVIP => {
            if (userVIP[0] != null)
            {
                hbscontent['isSubcriberVIP'] = true;
                var rows = userVIP[0];
                rows['subcribervip'] = "Thành viên VIP";
                var firstDate = new Date(rows.startdate);
                var finalDate = new Date(rows.enddate);
                var secondsDate = new Date(user[0].createddate);

                var numberOfDaysToAdd = 7;    
                finalDate.setDate(firstDate.getDate() + numberOfDaysToAdd);

                var dd = firstDate.getDate();
                var mm = firstDate.getMonth() + 1;
                var y = firstDate.getFullYear();
                var startDate = dd + '-'+ mm + '-'+ y; 

                var dd = finalDate.getDate();   
                var mm = finalDate.getMonth() + 1;
                var y = finalDate.getFullYear();
                var endDate = dd + '-'+ mm + '-'+ y; 

                var dd = secondsDate.getDate();   
                var mm = secondsDate.getMonth() + 1;
                var y = secondsDate.getFullYear();
                var createdDate = dd + '-'+ mm + '-'+ y; 

                rows['startdate'] = startDate;
                rows['enddate'] = endDate;
                user[0].createddate = createdDate;
                hbscontent['subcriber'] = user[0];
                hbscontent['subcriberVIP'] = rows;
                res.render('subcriber/subcriber-profile', hbscontent);
            }
            else 
            {
                var secondsDate = new Date(user[0].createddate);
                var dd = secondsDate.getDate();   
                var mm = secondsDate.getMonth() + 1;
                var y = secondsDate.getFullYear();
                var createdDate = dd + '-'+ mm + '-'+ y; 
                user[0].createddate = createdDate;

                hbscontent['isSubcriberVIP'] = false;
                hbscontent['subcriber'] = user[0];
                res.render('subcriber/subcriber-profile', hbscontent);
            }
        })
        .catch(next);
    })
    .catch(next);
});

router.get('/editprofile',authSubcriber, (req, res) => {
    hbscontent.title = "Cập nhật thông tin";
    hbscontent.isMainNavigationBar = false;
    userModel.single(hbscontent.currentuserid).then(user=>{
        hbscontent['subscriberName'] = user[0].name;
        hbscontent['subscriberEmail'] = user[0].email;
        hbscontent['subscriberPhone'] = user[0].phone;
        hbscontent['subscriberusername'] = user[0].username;
        if(user[0].gender=='Nam')
        {
            hbscontent['isMale'] =  true;
            hbscontent['isFemale'] =  false;
            res.render('subcriber/subcriber-editprofile',hbscontent);
        }
        else if(user[0].gender=='Nữ')
        {
            hbscontent['isFemale'] = true;
            hbscontent['isMale'] =  false;
            res.render('subcriber/subcriber-editprofile',hbscontent);
        }
        else
        {
            hbscontent['isFemale'] = false;
            hbscontent['isMale'] =  false;
            res.render('subcriber/subcriber-editprofile',hbscontent);
        }

      
    }).catch(err=>{
        console.log(err);
        res.end('Error occured');
    });
   
});

router.post('/editprofile',authSubcriber, (req, res) => {
    var entity = req.body;
    entity['id'] = hbscontent.currentuserid;
    userModel.update(entity).then(()=>{
        res.redirect('/subcriber/profile')
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});

router.get('/registrationvip', authSubcriber, (req, res) => {
    hbscontent.title = "Đăng kí thành viên VIP";
    hbscontent.isMainNavigationBar = false;
    userModel.single(hbscontent.currentuserid)
    .then(rows => {
        hbscontent['subscriberName'] = rows[0].name;
        var firstDate = new Date();
        var finalDate = new Date();
        var numberOfDaysToAdd = 7;    
        finalDate.setDate(finalDate.getDate() + numberOfDaysToAdd);

        var dd = firstDate.getDate();
        var mm = firstDate.getMonth() + 1;
        var y = firstDate.getFullYear();
        var startDate = dd + '-'+ mm + '-'+ y; 

        var dd = finalDate.getDate();   
        var mm = finalDate.getMonth() + 1;
        var y = finalDate.getFullYear();
        var endDate = dd + '-'+ mm + '-'+ y; 

        hbscontent['subscriberRegistration'] = startDate;
        hbscontent['subscriberExpiration'] = endDate;

        res.render('subcriber/subcriber-registrationvip', hbscontent)
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});

router.post('/registrationvip', authSubcriber, (req, res) => {
    var entity = req.body;

    var firstDate = new Date();
    var finalDate = new Date();
    var numberOfDaysToAdd = 7;    
    finalDate.setDate(finalDate.getDate() + numberOfDaysToAdd);

    var dd = firstDate.getDate();
    var mm = firstDate.getMonth() + 1;
    var y = firstDate.getFullYear();
    var startDate = dd + '-'+ mm + '-'+ y; 

    var dd = finalDate.getDate();   
    var mm = finalDate.getMonth() + 1;
    var y = finalDate.getFullYear();
    var endDate = dd + '-'+ mm + '-'+ y; 

    entity.startdate = firstDate;
    entity.enddate = finalDate;
    entity['iduser'] = hbscontent.currentuserid;
    delete entity['name'];
    vipsubcriberModel.add(entity)
    .then(() => {
        res.redirect('/subcriber/profile');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    })
});

router.get('/renewedvip', authSubcriber, (req, res) => {
    hbscontent.title = "Gia hạn thành viên VIP";
    hbscontent.isMainNavigationBar = false;
    userModel.single(hbscontent.currentuserid)
    .then(rows => {
        hbscontent['subscriberName'] = rows[0].name;
        var firstDate = new Date();
        var finalDate = new Date();
        var numberOfDaysToAdd = 7;    
        finalDate.setDate(finalDate.getDate() + numberOfDaysToAdd);

        var dd = firstDate.getDate();
        var mm = firstDate.getMonth() + 1;
        var y = firstDate.getFullYear();
        var startDate = dd + '-'+ mm + '-'+ y; 

        var dd = finalDate.getDate();   
        var mm = finalDate.getMonth() + 1;
        var y = finalDate.getFullYear();
        var endDate = dd + '-'+ mm + '-'+ y; 

        hbscontent['subscriberRegistration'] = startDate;
        hbscontent['subscriberExpiration'] = endDate;

        res.render('subcriber/subcriber-renewedvip', hbscontent)
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});

router.post('/renewedvip', authSubcriber, (req, res) => {
    var entity = req.body;

    var firstDate = new Date();
    var finalDate = new Date();
    var numberOfDaysToAdd = 7;    
    finalDate.setDate(finalDate.getDate() + numberOfDaysToAdd);

    var dd = firstDate.getDate();
    var mm = firstDate.getMonth() + 1;
    var y = firstDate.getFullYear();
    var startDate = dd + '-'+ mm + '-'+ y; 

    var dd = finalDate.getDate();   
    var mm = finalDate.getMonth() + 1;
    var y = finalDate.getFullYear();
    var endDate = dd + '-'+ mm + '-'+ y; 

    entity.startdate = firstDate;
    entity.enddate = finalDate;
    entity['iduser'] = hbscontent.currentuserid;
    delete entity['name'];
    vipsubcriberModel.update(entity)
    .then(() => {
        res.redirect('/subcriber/profile');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    })
});

router.get('/replacedpassword', authSubcriber, (req, res) => {
    hbscontent['isErrorFinish'] = false;
    hbscontent['isErrorConfirmpassword'] = false;
    res.render('subcriber/subcriber-replacedpassword', hbscontent);
   
});

router.post('/replacedpassword', authSubcriber, (req, res) => {
    var entity = req.body;
    if (entity.password == "")
    {
        hbscontent['isErrorFinish'] = true;
        hbscontent['isErrorConfirmpassword'] = false;
        res.render('subcriber/subcriber-replacedpassword', hbscontent);
    }
    if (entity.confirmpassword == "")
    {
        hbscontent['isErrorFinish'] = true;
        hbscontent['isErrorConfirmpassword'] = false;
        res.render('subcriber/subcriber-replacedpassword', hbscontent);
    }
    else 
    {
        if (entity.replacedpassword != entity.confirmpassword)
        {
            hbscontent['isErrorFinish'] = false;
            hbscontent['isErrorConfirmpassword'] = true;
            res.render('subcriber/subcriber-replacedpassword', hbscontent);
        }
        else 
        {
            var saltRounds = 10;
            userModel.single(hbscontent.currentuserid)
            .then(rows => {
                user = rows[0];
                user.password = bcrypt.hashSync(entity.replacedpassword, saltRounds);
                userModel.update(user)
                .then(() => {
                res.redirect('/');
                })
                .catch(err => {
                    console.log(err);
                    res.end('Error occured1');
                })
            })
            .catch(err => {
                console.log(err);
                res.end('Error occured2');
            })
        }
    }
    
});

    
module.exports = router;