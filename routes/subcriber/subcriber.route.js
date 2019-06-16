var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')
var userModel = require('../..//models/user.model')
var authSubcriber = require('../../middlewares/auth-subcriber');

router.get('/subcriber-editprofile',authSubcriber, (req, res) => {
    hbscontent.title = "Cập nhật thông tin";
    userModel.single(hbscontent.currentuserid).then(user=>{
        console.log(user);
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
module.exports = router;