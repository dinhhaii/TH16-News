var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')
var categoryModel = require('../..//models/category.model')
var postModel = require('../..//models/post.model')
var userModel = require('../..//models/user.model')
var authWriter = require('../../middlewares/auth-writer');

router.get('/',authWriter, (req, res) => {
    hbscontent.title = 'Writer';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isWriter = true;
    res.redirect('/writer/writepost');
});

router.get('/writepost',authWriter, (req, res, next) => {
    categoryModel.all()
        .then(rows => {
            hbscontent['categories'] = rows;
            res.render('writer/writer-writepost', hbscontent);
        })
        .catch(next);
});

router.post('/writepost', authWriter,(req, res) => {
    var entity = req.body;
    entity['views'] = 0;
    entity['status'] = "Chưa duyệt";
    entity['submittime'] = new Date();
    entity['createddate'] = new Date();
    entity['idwriter'] = hbscontent.currentuserid;
    postModel.add(entity)
    .then(() => {
        res.redirect('/writer/unapprovedpost');

    })
    .catch(err => {
        console.log(err);
        res.end('Error occured1');
    });

});

router.get('/approvedpost', authWriter,(req, res) => {
    var id = hbscontent.currentuserid;
    postModel.findIdWriterAndStatus(id,'Đã duyệt')
    .then(rows => {
        hbscontent['approvedposts'] = rows;
        hbscontent['error'] = false;
        rows.forEach(element => {
            var id = element.idcategory;
            var inputsummary = element.summary;
            var check = inputsummary.slice(0,15);
            categoryModel.getNameCategory(id)
            .then(name => {
                if (check == '<p class="mb-2">') {
                    element['summary'] = '<p class="mb-2">' + inputsummary + '</p>';
                    postModel.update(element).then().catch(err => { console.log(err)});
                }
                element['namecategory'] = name[0].name;
            })
            .catch(err => {
                console.log(err);
                res.end('Error occured1');
            });
        });
        console.log(rows);
        res.render('writer/writer-approvedpost', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured2');
    }); 
    
});

router.get('/unapprovedpost',authWriter, (req, res) => {
    var id = hbscontent.currentuserid;
    postModel.findIdWriterAndStatus(id,'Chưa duyệt')
    .then(rows => {
        hbscontent['unapprovedposts'] = rows;
        hbscontent['error'] = false;
        rows.forEach(element => {
            var id = element.idcategory;
            var inputsummary = element.summary;
            var check = inputsummary.slice(0,15);
            categoryModel.getNameCategory(id)
            .then(name => {
                if (check == '<p class="mb-2">') {
                    element['summary'] = '<p class="mb-2">' + inputsummary + '</p>';
                    postModel.update(element).then().catch(err => { console.log(err)});
                }
                element['namecategory'] = name[0].name;
            })
            .catch(err => {
                console.log(err);
                res.end('Error occured1');
            });
        });
        console.log(rows);
        res.render('writer/writer-unapprovedpost', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured2');
    }); 
});

router.get('/editpost/:id', authWriter,(req,res) => {
    var id = req.params.id;
    postModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['post'] = rows[0];
            hbscontent.isMainNavigationBar = false;
            res.render('writer/writer-editpost', hbscontent);
        }
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    }); 
})

router.post('/editpost',authWriter, (req,res) => {
    var entity = req.body;
    entity['summary'] = '<p class="mb-2">' + entity.summary + '</p>';
    postModel.update(entity)
    .then(() => {
        res.redirect('/writer/unapprovedpost');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
})
router.get('/writer-editprofile',authWriter,(req,res)=>{
    hbscontent.title = "Cập nhật thông tin";
    userModel.single(hbscontent.currentuserid).then(user=>{
        console.log(user);
        hbscontent['WriterName'] = user[0].name;
        hbscontent['WriterEmail'] = user[0].email;
        hbscontent['WriterPhone'] = user[0].phone;
        hbscontent['writerusername'] = user[0].username;
        hbscontent['writerpassword'] = user[0].password;
        if(user[0].gender=='Nam')
        {
            hbscontent['isMale'] =  true;
            hbscontent['isFemale'] =  false;
            res.render('writer/writer-editprofile', hbscontent);
        }
        else if(user[0].gender=='Nữ')
        {
            hbscontent['isFemale'] = true;
            hbscontent['isMale'] =  false;
            res.render('writer/writer-editprofile', hbscontent);
        }
        else
        {
            hbscontent['isFemale'] = false;
            hbscontent['isMale'] =  false;
            res.render('writer/writer-editprofile', hbscontent);
        }

      
    }).catch(err=>{
        console.log(err);
        res.end('Error occured');
    });
    
});
router.post('/writer-editprofile',authWriter, (req, res) => {

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
        res.redirect('/writer/writer-editprofile')
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});
router.get('/rejectedpost',authWriter, (req, res) => {
    var id = hbscontent.currentuserid;
    postModel.findIdWriterAndStatus(id,'Từ Chối')
    .then(rows => {
        hbscontent['rejectedposts'] = rows;
        hbscontent['error'] = false;
        rows.forEach(element => {
            var id = element.idcategory;
            categoryModel.getNameCategory(id)
            .then(name => {
                element['namecategory'] = name[0].name;
            })
            .catch(err => {
                console.log(err);
                res.end('Error occured1');
            });
        });
        console.log(rows);
        res.render('writer/writer-rejectedpost', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured2');
    }); 
});

router.get('/editprofile',authWriter, (req, res) => {

    res.render('writer/writer-editprofile', hbscontent);
});

module.exports = router;