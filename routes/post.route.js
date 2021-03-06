var express = require('express');
var router = express.Router();
var commentModel = require('../models/comment.model')
var postTagModel = require('../models/post-tag.model');
var postModel = require('../models/post.model');
var categoryModel = require('../models/category.model');
var userModel = require('../models/user.model');
var vipsubcriberModel = require('../models/vipsubcriber.model')
var hbscontent = require('../app');
var auth = require('../middlewares/auth');

router.get('/:id', (req, res, next) => {
    var id = req.params.id; //id post
    Promise.all([
        postModel.single(id),
        commentModel.amountComment()
    ]).then(([rows, listviewscomment]) => {
        userModel.single(rows[0].idwriter)
        .then(writer => {
            hbscontent['writername'] = writer[0].name;
        })
        .catch(next);

        var startDate = new Date(rows[0].publishdate);
        hbscontent['publishdate'] = (("0" + startDate.getDate()).slice(-2)) + "/" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "/" + (startDate.getFullYear()) + " " + (("0" + startDate.getHours()).slice(-2)) + ":" + (("0" + startDate.getMinutes()).slice(-2));
        hbscontent['viewscomment'] = 0;
        listviewscomment.forEach(element => {
            if (element.idproduct == rows[0].id)
                hbscontent['viewscomment'] = element.amount;                
        });
        rows[0].views = rows[0].views + 1;
        hbscontent['views'] = rows[0].views;
        postModel.update(rows[0]).then().catch(next);

        if (hbscontent.isLogin == true) {
            vipsubcriberModel.single(hbscontent.currentuserid)
            .then(user => {
                if (rows[0].ispremium == 1) {
                    if (user[0] != null || hbscontent.isAdmin == true || hbscontent.isEditor == true || hbscontent.isWriter == true) {
                        var idcat = rows[0].idcategory;
                        hbscontent['post'] = rows[0];
                        hbscontent['title'] = rows[0].titlepost;

                        postTagModel.allTagByPost(rows[0].id)
                        .then(posttagrows => {
                            hbscontent['posttags'] = posttagrows;
                        })
                        .catch(next);

                        // list comment
                        commentModel.descComment(id)
                        .then(lstcomment => {
                            lstcomment.forEach(element => {
                                var dt = element.createddate;
                                element['createddate'] = (("0" + dt.getDate()).slice(-2)) + "/" + (("0" + (dt.getMonth() + 1)).slice(-2)) + "/" + (dt.getFullYear()) + " " + (("0" + dt.getHours()).slice(-2)) + ":" + (("0" + dt.getMinutes()).slice(-2));
                            })
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
                                        postIDCat.splice(i, 1);
                                    }
                                }
                                postIDCat.splice(5, postIDCat.length - 1); // only 5 post
                                postIDCat.forEach(postID => {
                                    postID['viewscommentrelatedpost'] = 0;
                                    listviewscomment.forEach(element => {
                                        if (element.idproduct == postID.id)
                                            postID['viewscommentrelatedpost'] = element.amount;
                                    })
                                })
                                hbscontent['relatedpost'] = postIDCat;
                                categoryModel.single(idcat)
                                .then(catrows => {
                                    var namecat = catrows[0].name;
                                    hbscontent.isMainNavigationBar = true;
                                    hbscontent.breadcrumbitemactive = namecat;
                                    hbscontent['idcat'] = idcat;
                                    hbscontent['namecat'] = namecat;
                                    hbscontent['CheckIsPremium'] = true;
                                    res.render('singlepost', hbscontent);
                                })
                                .catch(next);
                            })
                            .catch(next);
                        })
                        .catch(next);
                    }
                    else
                    {
                        res.redirect('/subcriber/registrationvip');
                    }
                }
                else
                {
                    var idcat = rows[0].idcategory;
                    hbscontent['post'] = rows[0];
                    hbscontent['title'] = rows[0].titlepost;

                    postTagModel.allTagByPost(rows[0].id)
                    .then(posttagrows => {
                        hbscontent['posttags'] = posttagrows;
                    })
                    .catch(next);

                    // list comment
                    commentModel.descComment(id)
                    .then(lstcomment => {
                        lstcomment.forEach(element => {
                            var dt = element.createddate;
                            element['createddate'] = (("0" + dt.getDate()).slice(-2)) + "/" + (("0" + (dt.getMonth() + 1)).slice(-2)) + "/" + (dt.getFullYear()) + " " + (("0" + dt.getHours()).slice(-2)) + ":" + (("0" + dt.getMinutes()).slice(-2));
                        })
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
                                    postIDCat.splice(i, 1);
                                }
                            }
                            postIDCat.splice(5, postIDCat.length - 1); // only 5 post
                            postIDCat.forEach(postID => {
                                postID['viewscommentrelatedpost'] = 0;
                                listviewscomment.forEach(element => {
                                    if (element.idproduct == postID.id)
                                        postID['viewscommentrelatedpost'] = element.amount;
                                })
                            })
                            hbscontent['relatedpost'] = postIDCat;
                            categoryModel.single(idcat)
                            .then(catrows => {
                                var namecat = catrows[0].name;
                                hbscontent.isMainNavigationBar = true;
                                hbscontent.breadcrumbitemactive = namecat;
                                hbscontent['idcat'] = idcat;
                                hbscontent['namecat'] = namecat;
                                hbscontent['CheckIsPremium'] = false;
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
        }
        else
        {
            if (rows[0].ispremium == 1)
            {
                res.redirect('/login');
            }
            else
            {
                var idcat = rows[0].idcategory;
                hbscontent['post'] = rows[0];
                hbscontent['title'] = rows[0].titlepost;

                postTagModel.allTagByPost(rows[0].id)
                .then(posttagrows => {
                    hbscontent['posttags'] = posttagrows;
                })
                .catch(next);

                // list comment
                commentModel.descComment(id)
                .then(lstcomment => {
                    lstcomment.forEach(element => {
                        var dt = element.createddate;
                        element['createddate'] = (("0" + dt.getDate()).slice(-2)) + "/" + (("0" + (dt.getMonth() + 1)).slice(-2)) + "/" + (dt.getFullYear()) + " " + (("0" + dt.getHours()).slice(-2)) + ":" + (("0" + dt.getMinutes()).slice(-2));
                    })
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
                                postIDCat.splice(i, 1);
                            }
                        }
                        postIDCat.splice(5, postIDCat.length - 1); // only 5 post

                        postIDCat.forEach(postID => {
                            postID['viewscommentrelatedpost'] = 0;
                            listviewscomment.forEach(element => {
                                if (element.idproduct == postID.id)
                                    postID['viewscommentrelatedpost'] = element.amount;
                            })
                        })
                        hbscontent['relatedpost'] = postIDCat;
                        categoryModel.single(idcat)
                        .then(catrows => {
                            var namecat = catrows[0].name;
                            hbscontent.isMainNavigationBar = true;
                            hbscontent.breadcrumbitemactive = namecat;
                            hbscontent['idcat'] = idcat;
                            hbscontent['namecat'] = namecat;
                            hbscontent['CheckIsPremium'] = false;
                            res.render('singlepost', hbscontent);
                        })
                        .catch(next);
                    })
                    .catch(next);
                })
                .catch(next);
            }
        }
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured1');
    })
});

router.post('/:id', auth, (req, res, next) => {
    var entity = req.body;
    var id = req.params.id;
    entity['idproduct'] = id;
    entity['createddate'] = new Date();
    userModel.single(hbscontent.currentuserid)
        .then(rows => {
            var user = rows[0];
            entity['nameuser'] = user.name;
            commentModel.add(entity)
                .then(() => {
                    var url = "/post/" + id;
                    res.redirect(url);
                })
                .catch(next);
        })
        .catch(next);

})

module.exports = router;