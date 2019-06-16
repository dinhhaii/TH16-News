var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');

module.exports = function(app) {
    app.engine('hbs', exphbs({
        extname: 'hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/layouts',
        partialsDir: 'views/partials',
        helpers: { 
            section: hbs_sections() 
        }
    }));

    app.set('view engine', 'hbs');

}