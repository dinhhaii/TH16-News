var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var postModel = require('../models/post.model');
var userModel = require('../models/user.model');

router.get('/', (req, res, next) =>{    
    var content = hbscontent['keyword'];
    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 5;
    var offset = (page - 1) * limit;

    Promise.all([
        postModel.pagingSearch(content, limit, offset),
        postModel.countSearchResult(content)
    ]).then(([searchResults,count_searchResults])  => {
        console.log(searchResults);
        searchResults.forEach(element => {
            userModel.single(element.idwriter).then(userrows => {
                element['namewriter'] = userrows[0].name;
                var dt = new Date(Date(userrows[0].createddate));
                element['createddate'] = (("0"+dt.getDate()).slice(-2)) +"/"+ (("0"+(dt.getMonth()+1)).slice(-2)) +"/"+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2));

            })    
        });

        var total = count_searchResults[0].total;
        console.log(total);
        var npages = Math.floor(total / limit);
        if(total % limit > 0) npages++;

        var pages = [];
        for(i = 1; i <= npages; i++){
            var obj = {value: i, active: i === +page};
            pages.push(obj);
        }
        console.log(pages);
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        hbscontent.title = `"${content}"`;
        hbscontent['searchResults'] = searchResults;
        hbscontent['pages'] = pages;

        res.render('searchlist', hbscontent);
    }).catch(next);    
    
})

router.post('/', (req, res, next) =>{
    hbscontent['keyword'] = req.body.contentSearch;
    res.redirect('/search');
})

module.exports = router;