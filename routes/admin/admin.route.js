var express = require('express');
var router = express.Router();

var categoryModel = require('../../models/category.model');
var hbscontent = require('../../app');

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
        console.log(rows);

        hbscontent['categories'] = rows;
        //Update totalpost in category table
        rows.forEach(element => {
            categoryModel.update(element).then().catch(err => { console.log(err)});
        });
        console.log(rows);
        res.render('admin/category/admin-category', hbscontent);
    }).catch(err => {
        console.log(err);
    });
});

//Add category
router.get('/insertcategory', (req,res)=>{
    res.render('admin/category/admin-insertcategory', hbscontent);
});

router.post('/insertcategory', (req,res)=>{
    var entity = req.body;
    entity['totalpost'] = 0;
    entity['createddate'] = new Date();

    categoryModel.add(entity)
    .then(() => {
        res.render('admin/category/admin-insertcategory', hbscontent);
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


module.exports = router;