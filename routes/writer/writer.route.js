var express = require('express');
var router = express.Router();
var hbscontent = require('../../app')
var categoryModel = require('../..//models/category.model')
var postModel = require('../..//models/post.model')
var userModel = require('../..//models/user.model')

router.get('/', (req, res) => {
    hbscontent.title = 'Writer';
    hbscontent.isMainNavigationBar = false;
    hbscontent.isWriter = true;
    res.redirect('/writer/writepost');
});

router.get('/writepost', (req, res, next) => {
    categoryModel.all()
        .then(rows => {
            hbscontent['categories'] = rows;
            res.render('writer/writer-writepost');
        })
        .catch(next);
});

router.post('/writepost', (req, res) => {
    var entity = req.body;
    entity['view'] = 0;
    entity['status'] = "Chưa duyệt";
    entity['submittime'] = new Date();
    entity['createddate'] = new Date();
    entity['idwriter'] = hbscontent.currentuserid;
    postModel.add(entity)
        .then(() => {
            res.redirect('writer/writer-unapprovedpost');

        })
        .catch(err => {
            console.log(err);
            res.end('Error occured1');
        });

});

router.get('/approvedpost', (req, res) => {

    res.render('writer/writer-approvedpost', hbscontent);
});

router.get('/unapprovedpost', (req, res) => {

    res.render('writer/writer-unapprovedpost', hbscontent);
});

router.get('/rejectedpost', (req, res) => {

    res.render('writer/writer-rejectedpost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('writer/writer-editprofile');
});

module.exports = router;