var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');
var authEditor = require('../../middlewares/auth-editor');
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var posttagModel = require('../../models/post-tag.model');
var tagModel = require('../../models/tag.model');
var userModel = require('../../models/user.model');
var editorcategoryModel = require('../../models/editor-category.model');
var bcrypt = require('bcryptjs');
//=================================== Duyệt bài viết ===================================

router.get('/', authEditor, (req, res) => {
    hbscontent.title = 'Editor';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    res.redirect('/editor/approvepost');
});

router.get('/approvepost', authEditor, (req, res) => {    
    var listPostByEditor = [];
    editorcategoryModel.findideditor(hbscontent.currentuserid)
    .then(rows => {
        rows.forEach(element=>{
           
           postModel.allByCat(element.idcategory).then(postByCats=>{
            postByCats.forEach(d=>{
                
                
                if(d.status=="Chưa duyệt")
                {
                    d['isUnapproved'] = true; 
                }
                else if(d.status=="Đã duyệt")
                {
                    d['isApproved'] = true; 
                }
                else if(d.status=="Từ chối")
                {
                    d['isRejected'] = true; 
                }
                listPostByEditor.push(d);
            });
            hbscontent['posts'] = listPostByEditor;
            res.render('editor/editor-approvepost', hbscontent);
           }).catch(err=>{
            console.log(err);
           });
        });
       
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
           
            
        }).catch(err =>{
            console.log(err);
        });
        //Update totalpost in category table
      
     
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
                    res.redirect('/editor/approvepost');
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
    
    var listPostByEditor = [];
    editorcategoryModel.findideditor(hbscontent.currentuserid)
    .then(rows => {
        rows.forEach(element=>{
           
           postModel.allByCat(element.idcategory).then(postByCats=>{
            postByCats.forEach(d=>{
                
                
                if(d.status=="Chưa duyệt")
                {
                    d['isUnapproved'] = true; 
                }
                else if(d.status=="Đã duyệt")
                {
                    d['isApproved'] = true; 
                }
                else if(d.status=="Từ chối")
                {
                    d['isRejected'] = true; 
                }
                if(d.status=='Đã duyệt')
                {
                    listPostByEditor.push(d);
                }
               
            });
            hbscontent['approvedposts'] = listPostByEditor;
            res.render('editor/editor-approvedpost',hbscontent);
           }).catch(err=>{
            console.log(err);
           });
        });        
        
    }).catch(err => {
        console.log(err);
    }); 
    
    
});

router.get('/rejectedpost', authEditor, (req,res) => {
    var listPostByEditor = [];
    editorcategoryModel.findideditor(hbscontent.currentuserid)
    .then(rows => {
        rows.forEach(element=>{
           
           postModel.allByCat(element.idcategory).then(postByCats=>{
            postByCats.forEach(d=>{
                
                
                if(d.status=="Chưa duyệt")
                {
                    d['isUnapproved'] = true; 
                }
                else if(d.status=="Đã duyệt")
                {
                    d['isApproved'] = true; 
                }
                else if(d.status=="Từ chối")
                {
                    d['isRejected'] = true; 
                }
                if(d.status=='Từ chối')
                {
                    listPostByEditor.push(d);
                }
               
            });
            hbscontent['rejectedposts'] = listPostByEditor;
            res.render('editor/editor-rejectedpost',hbscontent);
           }).catch(err=>{
            console.log(err);
           });
        });        
        
    }).catch(err => {
        console.log(err);
    }); 
    
});
router.get('/editor-editprofile', authEditor, (req, res) => {
    hbscontent.title = 'Cập nhật thông tin';
     hbscontent.isMainNavigationBar = false;
     hbscontent.isEditor = true;
    
     hbscontent.isAdmin = false; 
     hbscontent.isWriter = false; 
     hbscontent.isSubcriber = false;
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
            var saltRounds = 10;
            var hash = bcrypt.hashSync(req.body.password, saltRounds);
            entity['password'] = hash;
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