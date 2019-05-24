var express = require('express');
var router = express.Router();

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
    }).catch(next);

    

});

module.exports = router;