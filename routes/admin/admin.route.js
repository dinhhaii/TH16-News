var express = require('express');
var router = express.Router();

var categoryModel = require('../../models/category.model');
var hbscontent = require('../../app');

router.get('/management', (req, res) => {
    var categoryItems = categoryModel.all();

    categoryItems.then(rows => {
        hbscontent['categories'] = rows;
        hbscontent.title = 'Quản trị viên';
        hbscontent.isAdmin = true;
        hbscontent.isMainNavigationBar = false;

        res.render('admin/admin-control', hbscontent);
    }).catch(err => {
        console.log(err);
    });

    
});

router.get('/insertcategory', (req,res)=>{
    hbscontent.isMainNavigationBar = false;

    res.render('admin/admin-insertcategory', hbscontent);
});

router.post('/insertcategory', (req,res)=>{
    var entity = req.body;
    entity['totalpost'] = 0;
    entity['createddate'] = new Date();

    categoryModel.add(entity)
    .then(() => {
        res.render('admin/admin-insertcategory', hbscontent);
    })
    .catch(err => {
        console.log(err)
    });
    
});

module.exports = router;