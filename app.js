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
    isSubcriber: false
};

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));

app.set('view engine', 'hbs');

app.use('/', express.static(publicPath));

//Routing 
app.use('/', require('./routes/index'));

app.use('/admin', require('./routes/admin/admin.route'));

app.use('/editor', require('./routes/editor/editor.route'));

app.use('/writer', require('./routes/writer/writer.route'));

app.use('/subcriber', require('./routes/subcriber/subcriber.route'));

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});

module.exports = hbsContent;