var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user');
    },

    add: (entity) => {
        return db.add('user', entity);
    },
    
    single: (id) => {
        return db.load(`select * from user where id = ${id}`);
    },

    findUsername: (username) => {
        return db.load(`select * from user where username = '${username}'`);
    },

    update: (entity) => {
        return db.update('user', 'id', entity);
    },

    delete: (id) => {
        return db.delete('user', 'id', id);
    }
}