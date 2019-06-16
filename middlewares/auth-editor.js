module.exports = (req, res, next) => {
    if(!req.user) {
        res.redirect('/login');
    }
    else {
        console.log(req.user);
        if(req.user.position == 'editor'){
            next();
        }
        else{
            res.redirect('/');
        }
        
    }
}