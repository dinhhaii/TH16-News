var express = require('express');
var router = express.Router();
var commentModel = require('../models/comment.model')
var postTagModel = require('../models/post-tag.model');
var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');

router.get('/:id', (req, res, next) => {
    var id = req.params.id; //id post
    postModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                var idcat = rows[0].idcategory;
                hbscontent['post'] = rows[0];
                hbscontent['title'] = rows[0].titlepost;

                postTagModel.allTagByPost(rows[0].id)
                .then(posttagrows => {
                    hbscontent['posttags'] = posttagrows;
                })
                .catch(next);

                // list comment
                commentModel.single(id)
                .then(lstcomment => {
                    console.log(lstcomment);
                    hbscontent['listcomment'] = lstcomment;
                })
                .catch(next);
                
                postModel.countByCat(idcat)
                .then(count => {
                    var limit = count[0].total;
                    postModel.latestpostIDCat(limit, idcat)
                    .then(postIDCat => {
                        for (var i = 0; i < postIDCat.length; i++) {
                            if (postIDCat[i].id == id) {
                                postIDCat.splice(i,1);
                            }
                        }
                        hbscontent['relatedpost'] = postIDCat;
                        categoryModel.single(idcat).then(catrows => {
                            var namecat = catrows[0].name;
                            hbscontent.isMainNavigationBar = true;
                            hbscontent.breadcrumbitemactive = namecat;
                            hbscontent['idcat'] = idcat;
                            hbscontent['namecat'] = namecat;
                            res.render('singlepost', hbscontent);
                        })
                        .catch(next);
                    })
                    .catch(next);
                })
                .catch(next);

                
            }
        })
        .catch(next);
});

router.post('/:id', (req, res, next) => {
    var entity = req.body;
    var id = req.params.id;
    entity['idproduct'] = id;
    entity['createddate'] = new Date();
    commentModel.add(entity)
        .then(() => {
            var url = "/post/" + id;
            res.redirect(url);
        })
        .catch(next);

})

module.exports = router;