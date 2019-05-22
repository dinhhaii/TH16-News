var categoryModel = require('../models/category.model')

module.exports = (req, res, next) => {
    categoryModel.all()
    .then(rows => {
        res.locals.categories = rows;
        next();
    })
    .catch(err => {
        console.log(err);
    })
}