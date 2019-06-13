var express = require('express');
var router = express.Router();
var hbscontent = require('../../app');
//post
var postModel = require('../../models/post.model');
var categoryModel = require('../../models/category.model');
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
    categoryModel.all().then(cateRows=>{
        console.log(cateRows);

        hbscontent['categories'] = cateRows;
        //Update totalpost in category table
        
       
        console.log(cateRows);
        res.render('editor/editor-approvepost', hbscontent);
    }).catch(err =>{
        console.log(err);
    });
});


router.post('/approvedpost/:id', (req, res) => {
    
    var entity = req.body;
    console.log(entity);
    var id = req.params.id;
    postModel.single(id)
    .then(rows=>{
        rows[0].status = "Đã duyệt";
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

router.get('/editprofile', (req, res) => {

    res.render('editor/editor-editprofile');
});

module.exports = router;