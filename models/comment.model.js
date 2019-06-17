var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from comment');
    },

    add: (entity) => {
        return db.add('comment', entity);
    },
    
    single: (idproduct) => {
        return db.load(`select * from comment where idproduct = ${idproduct}`);
    },

    update: (entity) => {
        return db.update('comment', 'id', entity);
    },

    delete: (id) => {   
        return db.delete('comment', 'id', id);
    }
}