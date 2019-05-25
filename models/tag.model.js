var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from tag');
    },

    add: (entity) => {
        return db.add('tag', entity);
    },
    
    single: (id) => {
        return db.load(`select * from tag where id = ${id}`);
    },

    update: (entity) => {
        return db.update('tag', 'id', entity);
    },

    delete: (id) => {
        return db.delete('tag', 'id', id);
    }
}