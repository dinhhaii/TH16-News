var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');
var authEditor = require('../../middlewares/auth-editor');
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var posttagModel = require('../../models/post-tag.model');
var tagModel = require('../../models/tag.model');
var userModel = require('../../models/user.model');

//=================================== Duyệt bài viết ===================================

router.get('/', authEditor, (req, res) => {
    hbscontent.title = 'Editor';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    res.redirect('/editor/approvepost');
});

router.get('/approvepost', authEditor, (req, res) => {    
    
    postModel.all()
    .then(rows => {
        hbscontent['posts'] = rows;
        categoryModel.all().then(cateRows=>{   
            hbscontent['categories'] = cateRows;
            //Update totalpost in category table
        }).catch(err =>{
            console.log(err);
        });
        //List tag
        tagModel.all().then(tagRows=>{
            hbscontent['tags'] = tagRows;
            //Update totalpost in category table
            res.render('editor/editor-approvepost', hbscontent);
        }).catch(err =>{
            console.log(err);
        });
        //Update totalpost in category table
        rows.forEach(element => {
            postModel.update(element).then().catch(err => { console.log(err)});
            if(element.status=="Chưa duyệt")
            {
                element['isUnapproved'] = true; 
            }
            else if(element.status=="Đã duyệt")
            {
                element['isApproved'] = true; 
            }
            else if(element.status=="Từ chối")
            {
                element['isRejected'] = true; 
            }
        });
     
    }).catch(err => {
        console.log(err);
    }); 
   
});


router.post('/approvedpost/:id', authEditor, (req, res) => {
    
    var entity = req.body;
    entity['status'] = 'Đã duyệt';

    var id = req.params.id;
    var entityPostTag;
    // entityPostTag['idpost'] = id;
    // entityPostTag['idtag'] = entity.idtag;
    entity['id'] = id;
    var idtag = entity.idtag;
    
    postModel.single(id)
    .then(rows=>{
        rows[0].status = "Đã duyệt";
        rows[0].idcategory = entity.idcategory;
        rows[0].publishdate = entity.publishdate;
        postModel.update(rows[0]).then(()=>{
            posttagModel.findidtag(idtag).then(tagRows=>{
                
                var check = false;
                tagRows.forEach(tagChild=>{
                    if(tagChild.idpost==id)
                    {
                        check =true;
                    }
                });
                if(check==false)
                {
                        var ef={
                            idpost:id,
                            idtag:entity.idtag,
                        }
                        posttagModel.add(ef).then(()=>{
                        res.redirect('/editor/approvepost');
                    })
                    .catch(err => {
                        console.log(err);
                        res.end('Error occured');
                    });
                }  
                else
                {
                    
                } 
                
            }).catch(err=>{
                console.log(err);
                res.end('Error occured');
            })
           
        }) 
        .catch(err => {
            console.log(err);
            res.end('Error occured');
        });
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
    
});

router.post('/rejectedpost/:id',authEditor, (req, res) => {

    
    var id = req.params.id;
    var entity = req.body;
    postModel.single(id)
    .then(rows=>{
        rows[0].status = "Từ chối";
        rows[0].reason = entity.reason;
        postModel.update(rows[0]).then(()=>{
            res.redirect('/editor/approvepost');
        }) 
        .catch(err => {
            console.log(err);
            res.end('Error occured');
        });
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
});

router.get('/approvedpost', authEditor, (req,res) => {
    var listApproved = [];
    postModel.all().then(rows=>{
        rows.forEach(post=>{
            if(post.status=='Đã duyệt')
            {
                listApproved.push(post);
            }
        });
        hbscontent['approvedposts'] = listApproved;
        res.render('editor/editor-approvedpost',hbscontent);
    }).catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
    
});

router.get('/rejectedpost', authEditor, (req,res) => {
    var listRejected = [];
    postModel.all().then(rows=>{
        rows.forEach(post=>{
            if(post.status=='Từ chối')
            {
                listRejected.push(post);
            }
        });
        hbscontent['rejectedposts'] = listRejected;
        res.render('editor/editor-rejectedpost',hbscontent);
    }).catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
    
});
router.get('/editor-editprofile', authEditor, (req, res) => {
    hbscontent.title = 'Cập nhật thông tin';
    // hbscontent.isMainNavigationBar = false;
    // hbscontent.isEditor = true;
    
    // hbscontent.isAdmin = false; 
    // hbscontent.isWriter = false; 
    // hbscontent.isSubcriber = false;
    userModel.single(hbscontent.currentuserid).then(user=>{
        console.log(user);
        hbscontent['EditorName'] = user[0].name;
        hbscontent['EditorEmail'] = user[0].email;
        hbscontent['EditorPhone'] = user[0].phone;
        hbscontent['Editorusername'] = user[0].username;
        hbscontent['Editorpassword'] = user[0].password;
        if(user[0].gender=='Nam')
        {
            hbscontent['isMale'] =  true;
            hbscontent['isFemale'] =  false;
            res.render('editor/editor-editprofile',hbscontent);
        }
        else if(user[0].gender=='Nữ')
        {
            hbscontent['isFemale'] = true;
            hbscontent['isMale'] =  false;
            res.render('editor/editor-editprofile',hbscontent);
        }
        else
        {
            res.render('writer/writer-editprofile', hbscontent);
        }
      
    }).catch(err=>{
        console.log(err);
        res.end('Error occured');
    });
    
});
router.post('/editor-editprofile', authEditor, (req, res) => {

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
        console.log(entity);
        res.redirect('/editor/editor-editprofile')
    })
    .catch(err=>{
        console.log(err);
        res.end('Error occured');
    })
});
module.exports = router;