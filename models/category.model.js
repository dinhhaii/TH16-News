var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from category');
    },

    add: (entity) => {
        return db.add('category', entity);
    },
    
    single: (id) => {
        return db.load(`select * from category where id = ${id}`);
    },

    update: (entity) => {
        return db.update('category', 'id', entity);
    },

    delete: (id) => {
        return db.delete('category', 'id', id);
    }
}