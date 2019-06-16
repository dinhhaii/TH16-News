module.exports = (req, res, next) => {
    if(!req.user) {
        res.redirect('/login');
    }
    else {
        console.log(req.user);
        if(req.user.position == 'subcriber'){
            next();
        }
        else{
            res.redirect('/');
        }
        
    }
}