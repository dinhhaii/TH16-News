var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');
//post
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
var posttagModel = require('../../models/post-tag.model');
var tagModel = require('../../models/tag.model');
var userModel = require('../../models/user.model');

//=================================== Duyệt bài viết ===================================

router.get('/', (req, res) => {
    hbscontent.title = 'Editor';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    res.redirect('/editor/approvepost');
});

router.get('/approvepost', (req, res) => {    
    
    postModel.all()
    .then(rows => {
        console.log(rows);

        hbscontent['posts'] = rows;
        categoryModel.all().then(cateRows=>{
            console.log(cateRows);
    
            hbscontent['categories'] = cateRows;
            //Update totalpost in category table
            
           
            console.log(cateRows);
           
        }).catch(err =>{
            console.log(err);
        });
        //List tag
        tagModel.all().then(tagRows=>{
            console.log(tagRows);
    
            hbscontent['tags'] = tagRows;
            //Update totalpost in category table
            
           
            console.log(tagRows);
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
       
        console.log(rows);
     
    }).catch(err => {
        console.log(err);
    }); 
   
});


router.post('/approvedpost/:id', (req, res) => {
    
    var entity = req.body;
    entity['status'] = 'Đã duyệt';
    
    console.log(entity);
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
                        console.log(tagChild);
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

router.post('/rejectedpost/:id', (req, res) => {

    
    var id = req.params.id;
    postModel.single(id)
    .then(rows=>{
        rows[0].status = "Từ chối";
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

router.get('/editor-editprofile', (req, res) => {
    hbscontent.title = 'Cập nhật thông tin';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isEditor = true;
    res.render('editor/editor-editprofile');
});
router.post('/editor-editprofile', (req, res) => {

    
    var id = req.params.id;
    
});
module.exports = router;