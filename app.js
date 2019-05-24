var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var app = express();
const publicPath = './assets';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());

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
    currentPage: '/'
};

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));

app.set('view engine', 'hbs');

app.use(require('./middlewares/locals.mdw'));

app.use('/', express.static(publicPath));

//Routing 
app.use('/', require('./routes/index'));

app.use('/login', require('./routes/login.route'));

app.use('/logout', require('./routes/logout.route'));

app.use('/post', require('./routes/post.route'));

app.use('/category', require('./routes/category.route'));

app.use('/admin', require('./routes/admin/admin.route'));

app.use('/editor', require('./routes/editor/editor.route'));

app.use('/writer', require('./routes/writer/writer.route'));

app.use('/subcriber', require('./routes/subcriber/subcriber.route'));

//Xử lý lỗi
app.use((req,res,next) => {
    res.render('404', {layout: false});
})

app.use((error,req,res,next) => {
    res.render('error', {layout: false, message: error.message, error});
})

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});

module.exports = {hbsContent,app};