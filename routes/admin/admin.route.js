var express = require('express');
var router = express.Router();
var tagModel = require('../../models/tag.model');
var categoryModel = require('../../models/category.model');
var hbscontent = require('../../app');

//post
var postModel = require('../../models/post.model');


router.get('/', (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/category');
});



//=================================== Quản lý chuyên mục ===================================
router.get('/category', (req, res) => {
    
    categoryModel.allWithDetail()
    .then(rows => {
        //console.log(rows);

        hbscontent['categories'] = rows;
        //Update totalpost in category table
        rows.forEach(element => {
            categoryModel.update(element).then().catch(err => { console.log(err)});
        });
        //console.log(rows);
        res.render('admin/category/admin-category', hbscontent);
    }).catch(err => {
        console.log(err);
    });
});

//Add category
router.get('/insertcategory', (req, res)=>{
    res.render('admin/category/admin-insertcategory', hbscontent);
});

router.post('/insertcategory', (req, res)=>{
    var entity = req.body;
    entity['totalpost'] = 0;
    entity['createddate'] = new Date();

    categoryModel.add(entity)
    .then(() => {
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
});

//Sửa danh mục
router.get('/editcategory/:id', (req, res) => {
    var id = req.params.id;
    categoryModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['category'] = rows[0];
            hbscontent.isMainNavigationBar = false;
            res.render('admin/category/admin-editcategory', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/editcategory', (req,res)=>{
    var entity = req.body;

    categoryModel.update(entity)
    .then(() => {
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deletecategory', (req,res) => {
    categoryModel.delete(req.body.id)
    .then(() => {
        //console.log(req.body);
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

//=================================== Quản lý nhãn ===================================

router.get('/', (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/tag');
});

router.get('/', (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/tag');
});

// select all table tag
router.get('/tag', (req, res) => {
    
    tagModel.all()
    .then(rows => {
        console.log(rows);

        hbscontent['tags'] = rows;
        //Update totalpost in tag table
        rows.forEach(element => {
            tagModel.update(element).then().catch(err => { console.log(err)});
        });
        console.log(rows);
        res.render('admin/tag/admin-tag', hbscontent);
    }).catch(err => {
        console.log(err);
    });
});

//Thêm nhãn
router.get('/inserttag', (req, res)=>{
    res.render('admin/tag/admin-inserttag', hbscontent);
});

router.post('/inserttag', (req, res)=>{
    var entity = req.body;
    entity['createddate'] = new Date();

    tagModel.add(entity)
    .then(() => {
        res.redirect('/admin/tag');
        
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

//Sửa nhãn
router.get('/edittag/:id', (req, res) => {
    var id = req.params.id;
    tagModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['tag'] = rows[0];
            hbscontent.isMainNavigationBar = false;
            res.render('admin/tag/admin-edittag', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/edittag', (req,res)=>{
    var entity = req.body;

    tagModel.update(entity)
    .then(() => {
        res.redirect('/admin/tag');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deletetag', (req,res) => {
    tagModel.delete(req.body.id)
    .then(() => {
        //console.log(req.body);
        res.redirect('/admin/tag');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

//=================================== Quản lý bài viết ===================================

router.get('/', (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/post');
});

router.get('/post', (req, res) => {
    
    postModel.all()
    .then(rows => {
        console.log(rows);

        hbscontent['posts'] = rows;
        //Update totalpost in category table
        rows.forEach(element => {
            postModel.update(element).then().catch(err => { console.log(err)});
        });
        console.log(rows);
        res.render('admin/post/admin-post', hbscontent);
    }).catch(err => {
        console.log(err);
    });
});
//Add post 
router.get('/insertpost', (req, res)=>{
    res.render('admin/post/admin-insertpost', hbscontent);
    
});

router.post('/insertpost', (req, res)=>{
    // handle alow or denied post to post database
    
    // var entity = req.body;
    // categoryModel.add(entity)
    // .then(() => {
    //     res.render('admin/category/admin-insertpost', hbscontent);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.end('Error occured');
    // });
    
});
//=================================== Quản lý nhãn ===================================



module.exports = router;