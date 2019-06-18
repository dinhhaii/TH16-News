var express = require('express');
var morgan = require('morgan');
var app = express();
const publicPath = './assets';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var hbsContent = {    
    isLogin: false,
    Username: '',
    title: '',
    breadcrumbitemactive: '',
    breadcrumbiteminactive: '',
    isMainNavigationBar: true,
    isAdmin: false,
    isEditor: false,
    isWriter: false,
    isSubcriber: false,
    currentPage: '/',
    currentuserid: 0
};

require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);
require('./middlewares/upload')(app);

app.use(require('./middlewares/locals.mdw'));
app.use('/', express.static(publicPath));

//Routing 
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login.route'));
app.use('/signup', require('./routes/signup.route'));
app.use('/logout', require('./routes/logout.route'));
app.use('/post', require('./routes/post.route'));
app.use('/tag', require('./routes/tag.route'));
app.use('/category', require('./routes/category.route'));
app.use('/admin', require('./routes/admin/admin.route'));
app.use('/editor', require('./routes/editor/editor.route'));
app.use('/writer', require('./routes/writer/writer.route'));
app.use('/subcriber', require('./routes/subcriber/subcriber.route'));
app.use('/search', require('./routes/search.route'));

//Lỗi
app.use((req, res, next) => { res.render('404', { layout: false }); })
app.use((error, req, res, next) => { res.render('error', { layout: false, message: error.message, error }); })

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});

module.exports = {hbsContent,app};