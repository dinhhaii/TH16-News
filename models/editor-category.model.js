var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from editor_category');
    },

   
    add: (entity) => {
        return db.add('editor_category',entity);
        
    },
    
    findidcategory: (id) => {
        return db.load(`select * from editor_category where idcategory = ${id}`);
    },
    findideditor: (id) => {
        return db.load(`select * from editor_category where ideditor = ${id}`);
    },
    update: (entity) => {
        return db.update('editor_category', 'idcategory', entity);
    },

    delete: (id) => {
        return db.delete('editor_category', 'ideditor', id);
    }
}