var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')
var userModel = require('../..//models/user.model')


router.get('/subcriber-editprofile', (req, res) => {
    hbscontent.title = "Cập nhật thông tin";
    userModel.single(hbscontent.currentuserid).then(user=>{
        console.log(user);
        hbscontent['subscriberName'] = user[0].name;
        hbscontent['subscriberEmail'] = user[0].email;
        hbscontent['subscriberPhone'] = user[0].phone;
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
router.post('/subcriber-editprofile', (req, res) => {

    var entity = req.body;
    entity['id'] = hbscontent.currentuserid;
    userModel.update(entity).then(()=>{
        res.redirect('/subcriber/subcriber-editprofile')
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});
module.exports = router;