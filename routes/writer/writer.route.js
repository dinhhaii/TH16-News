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
            res.render('writer/writer-writepost', hbscontent);
        })
        .catch(next);
});

router.post('/writepost', (req, res) => {
    var entity = req.body;
    entity['views'] = 0;
    entity['status'] = "Chưa duyệt";
    entity['submittime'] = new Date();
    entity['createddate'] = new Date();
    entity['idwriter'] = hbscontent.currentuserid;
    postModel.add(entity)
    .then(() => {
        res.redirect('/writer/unapprovedpost');

    })
    .catch(err => {
        console.log(err);
        res.end('Error occured1');
    });

});

router.get('/approvedpos', (req, res) => {
    res.render('writer/writer-approvedpost', hbscontent);
    
});

router.get('/unapprovedpost', (req, res) => {
    var id = hbscontent.currentuserid;
    postModel.findIdWriterAndStatus(id,'Chưa duyệt')
    .then(rows => {
        hbscontent['unapprovedposts'] = rows;
        hbscontent['error'] = false;
        rows.forEach(element => {
            var id = element.idcategory;
            var inputsummary = element.summary;
            var check = inputsummary.slice(0,15);
            categoryModel.getNameCategory(id)
            .then(name => {
                if (check == '<p class="mb-2">') {
                    element['summary'] = '<p class="mb-2">' + inputsummary + '</p>';
                    postModel.update(element).then().catch(err => { console.log(err)});
                }
                element['namecategory'] = name[0].name;
            })
            .catch(err => {
                console.log(err);
                res.end('Error occured1');
            });
        });
        console.log(rows);
        res.render('writer/writer-unapprovedpost', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured2');
    }); 
});

router.get('/rejectedpost', (req, res) => {

    res.render('writer/writer-rejectedpost', hbscontent);
});

router.get('/editprofile', (req, res) => {

    res.render('writer/writer-editprofile', hbscontent);
});

module.exports = router;