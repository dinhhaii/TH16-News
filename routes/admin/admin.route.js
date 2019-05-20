var express = require('express');
var router = express.Router();

var categoryModel = require('../../models/category.model');
var hbscontent = require('../../app');

//=================================== Quản lý chuyên mục ===================================
router.get('/category', (req, res) => {
    var categoryItems = categoryModel.all();

    categoryItems.then(rows => {
        hbscontent['categories'] = rows;
        hbscontent.title = 'Quản trị viên';
        hbscontent.isAdmin = true;
        hbscontent.isMainNavigationBar = false;

        res.render('admin/category/admin-category', hbscontent);
    }).catch(err => {
        console.log(err);
    });

    
});

//Thêm chuyên mục
router.get('/insertcategory', (req,res)=>{
    hbscontent.isMainNavigationBar = false;

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