var express = require('express');
var router = express.Router();

var postTagModel = require('../models/post-tag.model');
var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');


router.get('/:id', (req, res, next) => {
    var id = req.params.id; //id post

    postModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            var idcat = rows[0].idcategory;
            hbscontent['post'] = rows[0];
            hbscontent['title'] = rows[0].titlepost;

            postTagModel.allTagByPost(rows[0].id)
            .then(posttagrows => {
                hbscontent['posttags'] = posttagrows;
            })
            .catch(next);

            postModel.latestpostIDCat(5, idcat)
            .then(postIDCat => {
                postIDCat.forEach(element => {
                    categoryModel.single(element.idcategory).then(catrows => {
                        element['namecategory'] = catrows[0].name;
                        var dt = new Date(Date(element.createddate));
                        element['createddate'] = (("0"+dt.getDate()).slice(-2)) +"/"+ (("0"+(dt.getMonth()+1)).slice(-2)) +"/"+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2));
                    }).catch(next);
                hbscontent['latestposts'] = postIDCat;
                })
            }).catch(next);

            categoryModel.single(idcat).then(catrows => {
                if (catrows.length > 0) {            
                    var namecat = catrows[0].name;
                    hbscontent.isMainNavigationBar = true;
                    hbscontent.breadcrumbitemactive = namecat;
                    hbscontent['idcat'] = idcat;
                    hbscontent['namecat'] = namecat;

                    res.render('singlepost', hbscontent);
                }
            }).catch(next);
        }
    })
    .catch(next); 
});

module.exports = router;