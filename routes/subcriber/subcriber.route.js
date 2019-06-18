var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')
var userModel = require('../..//models/user.model')
var authSubcriber = require('../../middlewares/auth-subcriber');
var vipsubcriberModel = require('../..//models/vipsubcriber.model');

router.get('/subcriber-editprofile',authSubcriber, (req, res) => {
    hbscontent.title = "Cập nhật thông tin";
    userModel.single(hbscontent.currentuserid).then(user=>{
        hbscontent['subscriberName'] = user[0].name;
        hbscontent['subscriberEmail'] = user[0].email;
        hbscontent['subscriberPhone'] = user[0].phone;
        hbscontent['subscriberusername'] = user[0].username;
        hbscontent['subscriberpassword'] = user[0].password;
        console.log(hbscontent);
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

router.post('/subcriber-editprofile',authSubcriber, (req, res) => {

    var entity = req.body;
    if(entity.password.trim()=="")
    {
        delete entity['password'];
        delete entity['passwordconfirm'];
    }
    else
    {
        if(entity.password==entity.passwordconfirm)
        {
            delete entity['passwordconfirm'];
        }
        else
        {
            delete entity['password'];
            delete entity['passwordconfirm'];
        }
    }
    entity['id'] = hbscontent.currentuserid;
    userModel.update(entity).then(()=>{
        res.redirect('/subcriber/subcriber-editprofile')
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});

router.get('/subcriber-registrationvip', authSubcriber, (req, res) => {
    hbscontent.title = "Đăng kí thành viên VIP";
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

router.post('/subcriber-registrationvip', authSubcriber, (req, res) => {
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
    console.log(entity);
    vipsubcriberModel.add(entity)
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    })
});

module.exports = router;