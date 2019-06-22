var express = require('express');
var router = express.Router();
var tagModel = require('../../models/tag.model');
var categoryModel = require('../../models/category.model');
var hbscontent = require('../../app');
var userModel = require('../../models/user.model');
var authAdmin = require('../../middlewares/auth-admin');
var postModel = require('../../models/post.model');
var categorypostModel = require('../../models/editor-category.model');

router.get('/', authAdmin, (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/category');
});


//=================================== Quản lý chuyên mục ===================================
router.get('/category',authAdmin, (req, res) => {
    
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
router.get('/insertcategory',authAdmin, (req, res)=>{
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
router.get('/editcategory/:id',authAdmin, (req, res) => {
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

router.post('/editcategory',authAdmin, (req,res)=>{
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

router.post('/deletecategory',authAdmin, (req,res) => {
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

// select all table tag
router.get('/tag',authAdmin, (req, res) => {
    
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
router.get('/inserttag',authAdmin, (req, res)=>{
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
router.get('/edittag/:id',authAdmin, (req, res) => {
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

router.post('/edittag',authAdmin, (req,res)=>{
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

router.post('/deletetag',authAdmin, (req,res) => {
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

router.get('/',authAdmin, (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/post');
});

router.get('/post',authAdmin, (req, res) => {
    
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
        res.render('admin/post/admin-post', hbscontent);
    }).catch(err => {
        console.log(err);
    });
});

router.post('/approvepost/:id',authAdmin, (req,res)=>{
    var id = req.params.id;
    var entity = req.body;
    console.log(entity);
    postModel.single(id)
    .then(rows=>{
        rows[0].status = "Đã duyệt";
        rows[0].publishdate = entity.publishdate;
        postModel.update(rows[0]).then(()=>{
            console.log(entity);
            res.redirect('/admin/post');
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
//Edit post

router.get('/editpost/:id',authAdmin, (req, res) => {
    var id = req.params.id;
    postModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['post'] = rows[0];
            hbscontent.isMainNavigationBar = false;
            res.render('admin/post/admin-editpost', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/editpost', authAdmin, (req,res)=>{
    var entity = req.body;
    entity['summary'] = '<p class="mb-2">' + entity.summary + '</p>';
    entity['image'] = "/img/bg-img/" + entity.filename;
    delete entity['fuMain'];
    delete entity['filename'];
    postModel.update(entity)
    .then(() => {
        res.redirect('/admin/post');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deletepost/:id',authAdmin, (req,res, next)=>{
    var id = req.params.id;
    console.log(req.params);
    postModel.delete(id)
    .then(() => {
        res.redirect('/admin/post');
    })
    .catch(next);
    
});

//=================================== Quản lý người dùng ===================================

router.get('/', authAdmin,(req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.isMainNavigationBar = false;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/user');
});

// select all table user

router.get('/user',authAdmin, (req, res) => {
    var  str ={name: ""}
    userModel.all()
    .then(rows => {
        console.log(rows);
       
        var strarr = [];
        //Update totalpost in tag table
        rows.forEach(element => {
            //element['editorcategories'] = [];
           
            
            if(element.position=='editor')
            { 
                
                element.isEditor = true;
                categorypostModel.findideditor(element.id).then(categoryeditor=>{
                    if(categoryeditor.length>0)
                    {
                        categoryModel.getNameCategoryByEditor(categoryeditor[0].idcategory).then(namecate=>{
                           
                            strarr.push(namecate[0].name);
                            console.log(strarr);
                           
                        }).catch(err=>{
                            console.log(err);
                        });
                        
                    }
                    else
                    {
                        element.categoryofeditor = '';
                        element.categoryofeditor = "";
                    }
                    
                }).catch(err=>{
                    console.log(err);
                });

                
               // console.log(strarr);
            }
            else
            {
                element.isEditor = false;
                element.categoryofeditor = "";
            }
            
            
            
            
            
            
        });
        
        categoryModel.all().then(catRows=>{    
                   
            hbscontent['user'] = rows; 
            hbscontent['editorcategories'] = catRows;
            res.render('admin/user/admin-user', hbscontent);  
        }).catch(err=>{
            console.log(err);
        });
        
         
    }).catch(err => {
        console.log(err);
       
    });
                                          
        
});
// phân công chuyên mục cho editor
router.post('/editorcategory/:id',authAdmin, (req, res)=>{
    var entity = req.body;
    var idcat = entity.idcategory;
    var id = req.params.id;
    var categoryeditor ={
        idcategory : idcat,
        ideditor : id,
    }
    categorypostModel.update(categoryeditor).then().catch(err=>{console.log(err)});
   
    res.redirect('/admin/user');
    
});
//Thêm người dùng
router.get('/insertuser', authAdmin,(req, res)=>{
    res.render('admin/user/admin-insertuser', hbscontent);
});

router.post('/insertuser', (req, res)=>{
    var entity = req.body;
    entity['createddate'] = new Date();

    userModel.add(entity)
    .then(() => {
        res.redirect('/admin/user');
        
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

//Sửa người dùng
router.get('/edituser/:id',authAdmin, (req, res) => {
    var id = req.params.id;
    userModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['user'] = rows[0];
            if(rows[0].gender=='Nam')
            {
                hbscontent['isMale'] =  true;
                hbscontent['isFemale'] =  false;
                hbscontent.isMainNavigationBar = false;
            res.render('admin/user/admin-edituser', hbscontent);
            }
            if(rows[0].gender=='Nữ')
            {
                hbscontent['isFemale'] = true;
                hbscontent['isMale'] =  false;
                hbscontent.isMainNavigationBar = false;
            res.render('admin/user/admin-edituser', hbscontent);
            }
            
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/edituser',authAdmin, (req,res)=>{
    var entity = req.body;
    var saltRounds = 10;
    entity.password = bcrypt.hashSync(req.body.password, saltRounds);
    userModel.update(entity)
    .then(() => {
        res.redirect('/admin/user');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deleteuser',authAdmin, (req,res) => {
    userModel.delete(req.body.id)
    .then(() => {
        //console.log(req.body);
        res.redirect('/admin/user');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

module.exports = router;