var categoryModel = require('../models/category.model')
var hbscontent = require('../app');

module.exports = (req, res, next) => {
    categoryModel.all()
    .then(rows => {
        hbscontent['categories'] = rows;
        res.locals.categories = rows;
        next();
    })
    .catch(err => {
        console.log(err);
    });
}